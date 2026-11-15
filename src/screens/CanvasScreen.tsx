import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import { AppBar } from '../components/AppBar';
import { AppModal } from '../components/AppModal';
import { AppText } from '../components/AppText';
import { ColorInputModal } from '../components/ColorInputModal';
import { ColorPalette } from '../components/ColorPalette';
import { DrawingCanvas } from '../components/DrawingCanvas';
import { Icon } from '../components/Icon';
import { NameInputModal } from '../components/NameInputModal';
import { Ribbon } from '../components/Ribbon';
import { SliderRow } from '../components/SliderRow';
import { StatusBar } from '../components/StatusBar';
import { useToast } from '../components/Toast';
import { Workspace } from '../components/Workspace';
import { MAX_OPACITY, MAX_WIDTH, MIN_OPACITY, MIN_WIDTH } from '../constants/brush';
import { colors, gradient, radius, shadow, spacing } from '../constants/theme';
import { getAllDrawings, getDrawing, getDrawingStrokes, saveDrawing } from '../data/drawingRepository';
import { CAPTURE_RESULT } from '../data/imageFiles';
import { useBrushSettings } from '../hooks/useBrushSettings';
import { useDrawingHistory } from '../hooks/useDrawingHistory';
import { suggestDrawingName } from '../logic/validation';
import { Stroke } from '../models/drawing';
import { ScreenProps } from '../navigation/types';

type DialogType = 'none' | 'clear' | 'save' | 'color' | 'replace';

/** Bosh ekran: yuqori panel + lenta + kanvas + pastki panel + status satri. */
export function CanvasScreen({ navigation, route }: ScreenProps<'Canvas'>) {
  const history = useDrawingHistory();
  const brush = useBrushSettings();
  const showToast = useToast();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  /** Keng ekran (planshet yoki yotiq telefon): o'lcham va ranglar lentaga ko'chadi. */
  const isWide = width >= 760;
  /** Past ekran (yotiq telefon): kanvasga ko'proq joy qolishi uchun panellar ixchamlashadi. */
  const isShort = height < 520;

  const canvasRef = useRef<React.ComponentRef<typeof View>>(null);
  const [dialog, setDialog] = useState<DialogType>('none');
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [suggestedName, setSuggestedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDrawing, setPendingDrawing] = useState<{ name: string; strokes: Stroke[] } | null>(null);

  const { settings } = brush;
  const isEraser = settings.tool === 'eraser';
  const isEmpty = history.strokes.length === 0;
  const closeDialog = () => setDialog('none');

  // Galereyadan "Tahrirlash" bosilganda shu ekranga rasm ID si keladi.
  const openDrawingId = route.params?.openDrawingId;
  useEffect(() => {
    if (!openDrawingId || !history.isLoaded) {
      return;
    }
    navigation.setParams({ openDrawingId: undefined });
    (async () => {
      const [drawing, strokes] = await Promise.all([
        getDrawing(openDrawingId),
        getDrawingStrokes(openDrawingId),
      ]);
      if (!drawing || strokes.length === 0) {
        showToast("Bu rasmni tahrirlash uchun ochib bo'lmadi", 'error');
        return;
      }
      if (history.strokes.length > 0) {
        // Kanvasda chizma bor — avval so'raymiz.
        setPendingDrawing({ name: drawing.name, strokes });
        setDialog('replace');
      } else {
        history.replace(strokes);
        showToast(`“${drawing.name}” ochildi`);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDrawingId, history.isLoaded]);

  const handleSavePress = useCallback(async () => {
    if (isEmpty) {
      showToast("Kanvas bo'sh — avval biror narsa chizing", 'error');
      return;
    }
    const all = await getAllDrawings();
    setExistingNames(all.map((d) => d.name));
    setSuggestedName(suggestDrawingName());
    setDialog('save');
  }, [isEmpty, showToast]);

  const handleSave = async (name: string) => {
    setIsSaving(true);
    try {
      // Kanvasni PNG rasmga aylantirish.
      const uri = await captureRef(canvasRef, { format: 'png', quality: 1, result: CAPTURE_RESULT });
      await saveDrawing(name, uri, history.strokes);
      closeDialog();
      showToast(`“${name}” PNG sifatida saqlandi`, 'success');
    } catch (error) {
      console.warn(error);
      showToast('Rasmni saqlashda xatolik yuz berdi', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearConfirm = () => {
    history.clear();
    closeDialog();
    showToast('Kanvas tozalandi — “Orqaga” bilan qaytarish mumkin');
  };

  const handleReplaceConfirm = () => {
    if (pendingDrawing) {
      history.replace(pendingDrawing.strokes);
      showToast(`“${pendingDrawing.name}” ochildi`);
    }
    setPendingDrawing(null);
    closeDialog();
  };

  if (!history.isLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  /** Joriy rang (katta doira) — bosilsa "Ranglarni tahrirlash" ochiladi. */
  const currentColor = (size: number) => (
    <Pressable
      onPress={() => setDialog('color')}
      accessibilityRole="button"
      accessibilityLabel="Joriy rang"
      style={[styles.currentRing, { width: size + 8, height: size + 8 }]}
      testID="current-color"
    >
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: settings.color }} />
    </Pressable>
  );

  const sizeSlider = (compact: boolean) => (
    <SliderRow
      compact={compact}
      icon="circle-slice-8"
      label={isEraser ? "O'chirg'ich" : "O'lcham"}
      value={brush.activeWidth}
      min={MIN_WIDTH}
      max={MAX_WIDTH}
      step={1}
      format={(v) => `${v} px`}
      onChange={brush.setWidth}
      testID="size-slider"
    />
  );

  const opacitySlider = (compact: boolean) => (
    <SliderRow
      compact={compact}
      icon="opacity"
      label="Shaffoflik"
      value={settings.opacity}
      min={MIN_OPACITY}
      max={MAX_OPACITY}
      step={0.05}
      format={(v) => `${Math.round(v * 100)}%`}
      onChange={brush.setOpacity}
      disabled={isEraser}
      testID="opacity-slider"
    />
  );

  const palette = (layout: 'row' | 'grid') => (
    <ColorPalette
      layout={layout}
      selected={settings.color}
      dimmed={isEraser}
      onSelect={brush.setColor}
      onCustomPress={() => setDialog('color')}
    />
  );

  return (
    <View style={styles.container}>
      <AppBar
        compact={width < 430}
        dense={isShort}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={history.undo}
        onRedo={history.redo}
        onGallery={() => navigation.navigate('Gallery')}
        onSave={handleSavePress}
      />

      <Ribbon
        tool={settings.tool}
        fillShapes={settings.fillShapes}
        isEmpty={isEmpty}
        onToolChange={brush.setTool}
        onToggleFill={brush.toggleFill}
        onClear={() => setDialog('clear')}
        dense={isShort}
        extraGroups={
          isWide
            ? [
                {
                  title: "O'lcham",
                  node: (
                    <View style={styles.ribbonSliders}>
                      {sizeSlider(true)}
                      {opacitySlider(true)}
                    </View>
                  ),
                },
                {
                  title: 'Ranglar',
                  node: (
                    <View style={styles.ribbonColors}>
                      {currentColor(30)}
                      {palette('grid')}
                    </View>
                  ),
                },
              ]
            : []
        }
      />

      <Workspace>
        <View
          style={[
            styles.canvasShadow,
            isWide && !isShort && styles.canvasShadowWide,
            isShort && styles.canvasShadowShort,
          ]}
        >
          <View style={styles.canvasClip}>
            <DrawingCanvas
              captureRef={canvasRef}
              strokes={history.strokes}
              brush={settings}
              onStrokeEnd={history.addStroke}
            />
            {isEmpty && (
              // Ko'rsatma kanvas View'dan tashqarida — PNG ga tushmaydi.
              <View style={styles.hint} pointerEvents="none">
                <LinearGradient
                  colors={gradient.accent}
                  style={styles.hintIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="gesture" size={28} color="#fff" />
                </LinearGradient>
                <AppText weight="bold" size={17} color="#1E2433">
                  Chizishni boshlang
                </AppText>
                <AppText size={13} color="#7A8297">
                  Asbobni tanlang va barmog'ingiz bilan chizing
                </AppText>
              </View>
            )}
          </View>
        </View>
      </Workspace>

      {!isWide && (
        <View style={styles.dock}>
          <View style={styles.dockColors}>
            {currentColor(34)}
            <View style={styles.flex}>{palette('row')}</View>
          </View>
          {sizeSlider(false)}
          {opacitySlider(false)}
        </View>
      )}

      <View style={{ paddingBottom: insets.bottom, backgroundColor: colors.bg }}>
        <StatusBar tool={settings.tool} color={settings.color} objectCount={history.strokes.length} />
      </View>

      <AppModal
        visible={dialog === 'clear'}
        icon="delete-sweep-outline"
        tone="danger"
        title="Kanvasni tozalash"
        message="Barcha chizilganlar o'chiriladi. Xohlasangiz, keyin “Orqaga” tugmasi bilan qaytarishingiz mumkin."
        onRequestClose={closeDialog}
        actions={[
          { label: 'Bekor qilish', onPress: closeDialog },
          { label: 'Tozalash', onPress: handleClearConfirm, variant: 'danger', testID: 'confirm-clear' },
        ]}
      />

      <AppModal
        visible={dialog === 'replace'}
        icon="file-replace-outline"
        title="Rasmni ochish"
        message={`Kanvasdagi joriy chizma “${pendingDrawing?.name ?? ''}” bilan almashtiriladi. Joriy chizmani “Orqaga” orqali qaytarish mumkin.`}
        onRequestClose={() => {
          setPendingDrawing(null);
          closeDialog();
        }}
        actions={[
          {
            label: 'Bekor qilish',
            onPress: () => {
              setPendingDrawing(null);
              closeDialog();
            },
          },
          { label: 'Ochish', onPress: handleReplaceConfirm, variant: 'accent', testID: 'confirm-replace' },
        ]}
      />

      <NameInputModal
        visible={dialog === 'save'}
        title="PNG sifatida saqlash"
        message="Rasm telefon xotirasiga saqlanadi va “Mening rasmlarim” bo'limida ko'rinadi."
        initialName={suggestedName}
        submitLabel="Saqlash"
        existingNames={existingNames}
        busy={isSaving}
        onCancel={closeDialog}
        onSubmit={handleSave}
      />

      <ColorInputModal
        visible={dialog === 'color'}
        initialColor={settings.color}
        onCancel={closeDialog}
        onSubmit={(color) => {
          brush.setColor(color);
          closeDialog();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  canvasShadow: {
    flex: 1,
    margin: spacing.md,
    borderRadius: radius.xs,
    backgroundColor: colors.canvas,
    ...shadow.canvas,
  },
  canvasShadowWide: {
    margin: spacing.xl,
  },
  canvasShadowShort: {
    margin: spacing.sm,
  },
  canvasClip: {
    flex: 1,
    borderRadius: radius.xs,
    overflow: 'hidden',
  },
  hint: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  hintIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  dock: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    gap: 2,
  },
  dockColors: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  currentRing: {
    borderRadius: radius.round,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  ribbonSliders: {
    width: 250,
    gap: 2,
  },
  ribbonColors: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
