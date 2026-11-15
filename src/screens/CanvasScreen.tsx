import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import { AppModal } from '../components/AppModal';
import { ColorInputModal } from '../components/ColorInputModal';
import { DrawingCanvas } from '../components/DrawingCanvas';
import { NameInputModal } from '../components/NameInputModal';
import { useToast } from '../components/Toast';
import { Toolbar } from '../components/Toolbar';
import { colors, radius, spacing } from '../constants/theme';
import { getAllDrawings, getDrawing, getDrawingStrokes, saveDrawing } from '../data/drawingRepository';
import { CAPTURE_RESULT } from '../data/imageFiles';
import { useBrushSettings } from '../hooks/useBrushSettings';
import { useDrawingHistory } from '../hooks/useDrawingHistory';
import { suggestDrawingName } from '../logic/validation';
import { Stroke } from '../models/drawing';
import { ScreenProps } from '../navigation/types';

type DialogType = 'none' | 'clear' | 'save' | 'color' | 'replace';

/** Bosh ekran: kanvas + asboblar paneli. */
export function CanvasScreen({ navigation, route }: ScreenProps<'Canvas'>) {
  const history = useDrawingHistory();
  const brush = useBrushSettings();
  const showToast = useToast();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height && width >= 600;

  const canvasRef = useRef<React.ComponentRef<typeof View>>(null);
  const [dialog, setDialog] = useState<DialogType>('none');
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [suggestedName, setSuggestedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDrawing, setPendingDrawing] = useState<{ name: string; strokes: Stroke[] } | null>(
    null,
  );

  const isEmpty = history.strokes.length === 0;
  const closeDialog = () => setDialog('none');

  // Sarlavhaning o'ng tomonida "Galereya" tugmasi.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate('Gallery')}
          accessibilityRole="button"
          accessibilityLabel="Mening rasmlarim"
          style={styles.headerButton}
          testID="open-gallery"
        >
          <Ionicons name="images-outline" size={22} color={colors.primary} />
          <Text style={styles.headerButtonText}>Rasmlarim</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

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
      const uri = await captureRef(canvasRef, {
        format: 'png',
        quality: 1,
        result: CAPTURE_RESULT,
      });
      await saveDrawing(name, uri, history.strokes);
      closeDialog();
      showToast(`“${name}” PNG sifatida saqlandi`, 'success');
    } catch (error) {
      console.warn(error);
      showToast("Rasmni saqlashda xatolik yuz berdi", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearConfirm = () => {
    history.clear();
    closeDialog();
    showToast("Kanvas tozalandi. Qaytarish uchun “Orqaga” ni bosing");
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
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const toolbar = (
    <Toolbar
      settings={brush.settings}
      activeWidth={brush.activeWidth}
      canUndo={history.canUndo}
      canRedo={history.canRedo}
      isEmpty={isEmpty}
      vertical={isLandscape}
      onToolChange={brush.setTool}
      onColorChange={brush.setColor}
      onCustomColor={() => setDialog('color')}
      onWidthChange={brush.setWidth}
      onUndo={history.undo}
      onRedo={history.redo}
      onClear={() => setDialog('clear')}
      onSave={handleSavePress}
    />
  );

  return (
    <View style={[styles.container, isLandscape && styles.row]}>
      <View style={styles.canvasWrapper}>
        <DrawingCanvas
          captureRef={canvasRef}
          strokes={history.strokes}
          brush={brush.settings}
          onStrokeEnd={history.addStroke}
        />
        {isEmpty && (
          // Ko'rsatma kanvasdan tashqarida joylashgan — PNG ga tushmaydi.
          <View style={styles.hint} pointerEvents="none">
            <Ionicons name="finger-print-outline" size={36} color={colors.disabled} />
            <Text style={styles.hintText}>Barmog'ingiz bilan chizishni boshlang</Text>
          </View>
        )}
      </View>

      {isLandscape ? (
        <ScrollView
          style={[styles.sidePanel, { paddingRight: insets.right }]}
          contentContainerStyle={{ paddingBottom: insets.bottom + spacing.md }}
        >
          {toolbar}
        </ScrollView>
      ) : (
        <View style={{ paddingBottom: insets.bottom, backgroundColor: colors.surface }}>{toolbar}</View>
      )}

      <AppModal
        visible={dialog === 'clear'}
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
          { label: 'Ochish', onPress: handleReplaceConfirm, variant: 'primary' },
        ]}
      />

      <NameInputModal
        visible={dialog === 'save'}
        title="PNG sifatida saqlash"
        initialName={suggestedName}
        submitLabel="Saqlash"
        existingNames={existingNames}
        busy={isSaving}
        onCancel={closeDialog}
        onSubmit={handleSave}
      />

      <ColorInputModal
        visible={dialog === 'color'}
        initialColor={brush.settings.color}
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
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasWrapper: {
    flex: 1,
    margin: spacing.sm,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.canvas,
  },
  hint: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  hintText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  sidePanel: {
    width: 320,
    flexGrow: 0,
    backgroundColor: colors.surface,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  headerButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
});
