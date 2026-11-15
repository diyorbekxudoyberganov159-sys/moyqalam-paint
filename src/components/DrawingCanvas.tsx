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
import Svg, { Ellipse, Line, Path, Rect } from 'react-native-svg';

import { colors } from '../constants/theme';
import { cursorStore } from '../logic/cursorStore';
import { createId } from '../logic/id';
import { pointsToPath, shouldAddPoint } from '../logic/path';
import { effectiveOpacity, ellipseFromPoints, isShapeBigEnough, rectFromPoints } from '../logic/shapes';
import { BrushSettings, isShapeTool, Point, Stroke } from '../models/drawing';

interface Props {
  strokes: Stroke[];
  brush: BrushSettings;
  onStrokeEnd: (stroke: Stroke) => void;
  /** captureRef (PNG olish) uchun kerak bo'ladigan ref. */
  captureRef?: React.Ref<React.ComponentRef<typeof View>>;
}

/** O'chirg'ich fon rangida chiziladi. */
const paintColor = (stroke: Pick<Stroke, 'tool' | 'color'>) =>
  stroke.tool === 'eraser' ? colors.canvas : stroke.color;

/** Bitta obyektni (chiziq yoki shakl) SVG elementiga aylantiradi. */
const StrokeView = memo(function StrokeView({ stroke }: { stroke: Stroke }) {
  const color = paintColor(stroke);
  const opacity = effectiveOpacity(stroke);
  const common = {
    stroke: color,
    strokeWidth: stroke.width,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    opacity,
  };
  const [a, b = a] = stroke.points;

  switch (stroke.tool) {
    case 'line':
      return <Line x1={a.x} y1={a.y} x2={b.x} y2={b.y} {...common} />;
    case 'rect': {
      const r = rectFromPoints(a, b);
      return <Rect {...r} rx={2} {...common} fill={stroke.fill ? color : 'none'} />;
    }
    case 'ellipse': {
      const e = ellipseFromPoints(a, b);
      return <Ellipse {...e} {...common} fill={stroke.fill ? color : 'none'} />;
    }
    default:
      return <Path d={pointsToPath(stroke.points)} {...common} fill="none" />;
  }
});

/** Tugallangan obyektlar qatlami — `memo` tufayli yangi chiziq chizilganda qayta hisoblanmaydi. */
const StrokesLayer = memo(function StrokesLayer({ strokes }: { strokes: Stroke[] }) {
  return (
    <>
      {strokes.map((stroke) => (
        <StrokeView key={stroke.id} stroke={stroke} />
      ))}
    </>
  );
});

/**
 * Chizish maydoni. Barmoq harakati PanResponder orqali kuzatiladi:
 *  Grant (barmoq tegdi) → Move (siljidi) → Release (ko'tarildi).
 *  - Erkin asboblarda (qalam, marker, o'chirg'ich) har siljishda nuqta qo'shiladi.
 *  - Shakllarda faqat [boshlang'ich, joriy] nuqta saqlanadi — shakl "cho'zilib" ko'rinadi.
 * Barmoq ko'tarilganda tayyor obyekt `onStrokeEnd` orqali tarixga yuboriladi.
 */
export function DrawingCanvas({ strokes, brush, onStrokeEnd, captureRef }: Props) {
  const [live, setLive] = useState<Stroke | null>(null);
  const liveRef = useRef<Stroke | null>(null);
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

    const update = (stroke: Stroke | null) => {
      liveRef.current = stroke;
      setLive(stroke);
    };

    const finish = () => {
      const stroke = liveRef.current;
      cursorStore.setPoint(null);
      update(null);
      if (!stroke) {
        return;
      }
      if (isShapeTool(stroke.tool) && !isShapeBigEnough(stroke.points[0], stroke.points[1])) {
        return; // tasodifiy teginish — shakl qo'shilmaydi
      }
      onStrokeEndRef.current(stroke);
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Chizish paytida boshqa element (masalan, scroll) teginishni tortib olmasin.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        const point = readPoint(event);
        const b = brushRef.current;
        cursorStore.setPoint(point);
        update({
          id: createId(),
          tool: b.tool,
          color: b.color,
          width: b.tool === 'eraser' ? b.eraserWidth : b.penWidth,
          opacity: b.opacity,
          fill: b.fillShapes,
          points: isShapeTool(b.tool) ? [point, point] : [point],
        });
      },
      onPanResponderMove: (event) => {
        const current = liveRef.current;
        if (!current) {
          return;
        }
        const point = readPoint(event);
        cursorStore.setPoint(point);
        if (isShapeTool(current.tool)) {
          update({ ...current, points: [current.points[0], point] });
        } else if (shouldAddPoint(current.points[current.points.length - 1], point)) {
          update({ ...current, points: [...current.points, point] });
        }
      },
      onPanResponderRelease: finish,
      onPanResponderTerminate: finish,
    });
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    sizeRef.current = { width, height };
    cursorStore.setSize(width, height);
  };

  return (
    <View
      ref={captureRef}
      collapsable={false}
      style={[styles.canvas, webPointer]}
      onLayout={handleLayout}
      {...responder.panHandlers}
      testID="drawing-canvas"
    >
      {/* pointerEvents="none" — teginish koordinatalari doim kanvasga nisbatan hisoblanadi */}
      <Svg width="100%" height="100%" pointerEvents="none">
        <StrokesLayer strokes={strokes} />
        {live && <StrokeView stroke={live} />}
      </Svg>
    </View>
  );
}

/** Webda sichqoncha bilan chizganda sahifa aylanib ketmasligi uchun. */
const webPointer = Platform.select<ViewStyle>({
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
