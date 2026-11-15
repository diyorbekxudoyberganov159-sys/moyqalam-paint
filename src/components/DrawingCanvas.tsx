import React, { memo, useMemo, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '../constants/theme';
import { createId } from '../logic/id';
import { pointsToPath, shouldAddPoint } from '../logic/path';
import { BrushSettings, Point, Stroke } from '../models/drawing';

interface Props {
  strokes: Stroke[];
  brush: BrushSettings;
  onStrokeEnd: (stroke: Stroke) => void;
  /** captureRef (PNG olish) uchun kerak bo'ladigan ref. */
  captureRef?: React.Ref<React.ComponentRef<typeof View>>;
}

/** O'chirg'ich chizig'i fon rangida chiziladi. */
const strokeColor = (stroke: Pick<Stroke, 'tool' | 'color'>) =>
  stroke.tool === 'eraser' ? colors.canvas : stroke.color;

/** Bitta chiziqni SVG Path sifatida chizadi. */
const StrokePath = memo(function StrokePath({ stroke }: { stroke: Stroke }) {
  const d = useMemo(() => pointsToPath(stroke.points), [stroke.points]);
  return (
    <Path
      d={d}
      stroke={strokeColor(stroke)}
      strokeWidth={stroke.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
});

/**
 * Tugallangan chiziqlar qatlami. `memo` tufayli yangi chiziq chizilayotganda
 * eski chiziqlar qayta hisoblanmaydi — ilova tez ishlaydi.
 */
const StrokesLayer = memo(function StrokesLayer({ strokes }: { strokes: Stroke[] }) {
  return (
    <>
      {strokes.map((stroke) => (
        <StrokePath key={stroke.id} stroke={stroke} />
      ))}
    </>
  );
});

/**
 * Chizish maydoni. Barmoq harakati PanResponder orqali kuzatiladi:
 *  Grant (barmoq tegdi) → Move (siljidi) → Release (ko'tarildi).
 * Chizilayotgan chiziq `livePoints` da turadi, barmoq ko'tarilganda
 * tayyor Stroke `onStrokeEnd` orqali tarixga yuboriladi.
 */
export function DrawingCanvas({ strokes, brush, onStrokeEnd, captureRef }: Props) {
  const [livePoints, setLivePoints] = useState<Point[] | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });

  // PanResponder bir marta yaratiladi, shuning uchun eng so'nggi qiymatlarni ref orqali o'qiymiz.
  const brushRef = useRef(brush);
  brushRef.current = brush;
  const onStrokeEndRef = useRef(onStrokeEnd);
  onStrokeEndRef.current = onStrokeEnd;

  const responder = useMemo(() => {
    /** Teginish nuqtasini kanvas chegarasida ushlab turadi. */
    const readPoint = (event: GestureResponderEvent): Point => {
      const { locationX, locationY } = event.nativeEvent;
      const { width, height } = sizeRef.current;
      return {
        x: Math.min(Math.max(locationX, 0), width || locationX),
        y: Math.min(Math.max(locationY, 0), height || locationY),
      };
    };

    const finish = () => {
      const points = pointsRef.current;
      if (points.length > 0) {
        const { tool, color, penWidth, eraserWidth } = brushRef.current;
        onStrokeEndRef.current({
          id: createId(),
          tool,
          color,
          width: tool === 'pen' ? penWidth : eraserWidth,
          points,
        });
      }
      pointsRef.current = [];
      setLivePoints(null);
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Chizish paytida boshqa element (masalan, scroll) teginishni tortib olmasin.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        const point = readPoint(event);
        pointsRef.current = [point];
        setLivePoints([point]);
      },
      onPanResponderMove: (event) => {
        const point = readPoint(event);
        const points = pointsRef.current;
        if (shouldAddPoint(points[points.length - 1], point)) {
          pointsRef.current = [...points, point];
          setLivePoints(pointsRef.current);
        }
      },
      onPanResponderRelease: finish,
      onPanResponderTerminate: finish,
    });
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    sizeRef.current = { width, height };
  };

  const liveWidth = brush.tool === 'pen' ? brush.penWidth : brush.eraserWidth;

  return (
    <View
      ref={captureRef}
      collapsable={false}
      style={[styles.canvas, webNoScroll]}
      onLayout={handleLayout}
      {...responder.panHandlers}
      testID="drawing-canvas"
    >
      {/* pointerEvents="none" — teginish koordinatalari doim kanvasga nisbatan hisoblanadi */}
      <Svg width="100%" height="100%" pointerEvents="none">
        <StrokesLayer strokes={strokes} />
        {livePoints && (
          <Path
            d={pointsToPath(livePoints)}
            stroke={strokeColor(brush)}
            strokeWidth={liveWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}
      </Svg>
    </View>
  );
}

/** Webda sichqoncha/barmoq bilan chizganda sahifa aylanib ketmasligi uchun. */
const webNoScroll = Platform.select<ViewStyle>({
  web: { touchAction: 'none', cursor: 'crosshair', userSelect: 'none' } as unknown as ViewStyle,
  default: {},
});

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: colors.canvas,
    overflow: 'hidden',
  },
});
