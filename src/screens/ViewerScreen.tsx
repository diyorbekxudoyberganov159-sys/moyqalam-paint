import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppModal } from '../components/AppModal';
import { AppText } from '../components/AppText';
import { GradientButton } from '../components/GradientButton';
import { Icon, IconName } from '../components/Icon';
import { NameInputModal } from '../components/NameInputModal';
import { useToast } from '../components/Toast';
import { colors, radius, shadow, spacing } from '../constants/theme';
import { deleteDrawing, getAllDrawings, getDrawing, renameDrawing } from '../data/drawingRepository';
import { saveToGallery, shareImage } from '../data/imageExport';
import { formatDateTime } from '../logic/format';
import { SavedDrawing } from '../models/drawing';
import { ScreenProps } from '../navigation/types';

function ActionTile(props: { icon: IconName; label: string; onPress: () => void; danger?: boolean }) {
  const tint = props.danger ? colors.danger : colors.text;
  return (
    <Pressable
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityLabel={props.label}
      style={({ pressed }) => [styles.tile, props.danger && styles.tileDanger, pressed && styles.pressed]}
    >
      <Icon name={props.icon} size={22} color={props.danger ? colors.danger : colors.accent} />
      <AppText size={12} weight="semibold" color={tint}>
        {props.label}
      </AppText>
    </Pressable>
  );
}

function Chip({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.chip}>
      <Icon name={icon} size={13} color={colors.textMuted} />
      <AppText size={12} weight="medium" color={colors.textMuted}>
        {text}
      </AppText>
    </View>
  );
}

/** Bitta saqlangan rasmni ko'rish: tahrirlash, galereyaga saqlash, ulashish, nomlash, o'chirish. */
export function ViewerScreen({ navigation, route }: ScreenProps<'Viewer'>) {
  const { id } = route.params;
  const [drawing, setDrawing] = useState<SavedDrawing | null | undefined>(undefined);
  const [dialog, setDialog] = useState<'none' | 'delete' | 'rename'>('none');
  const [otherNames, setOtherNames] = useState<string[]>([]);
  /** Rasm proporsiyasi (kenglik/balandlik) — yuklangach aniqlanadi, hoshiya qolmasligi uchun. */
  const [aspect, setAspect] = useState(0.75);
  const showToast = useToast();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height && width >= 700;

  const load = useCallback(async () => {
    const found = await getDrawing(id);
    setDrawing(found ?? null);
    if (found) {
      navigation.setOptions({ title: found.name });
    }
  }, [id, navigation]);

  useEffect(() => {
    load();
  }, [load]);

  // Rasm o'lchamini o'qib, ramkani aynan unga moslaymiz (atrofida bo'sh hoshiya qolmaydi).
  const imageUri = drawing?.imageUri;
  useEffect(() => {
    if (!imageUri) {
      return;
    }
    Image.getSize(
      imageUri,
      (w, h) => {
        if (w > 0 && h > 0) {
          setAspect(w / h);
        }
      },
      () => {},
    );
  }, [imageUri]);

  if (drawing === undefined) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (drawing === null) {
    return (
      <View style={styles.center}>
        <Icon name="alert-circle-outline" size={48} color={colors.danger} />
        <AppText color={colors.textMuted}>Rasm topilmadi yoki o'chirilgan.</AppText>
      </View>
    );
  }

  const handleGallery = async () => {
    try {
      const result = await saveToGallery(drawing.imageUri, drawing.name);
      if (result === 'ok') {
        showToast(
          Platform.OS === 'web' ? 'PNG fayl yuklab olindi' : 'Rasm telefon galereyasiga saqlandi',
          'success',
        );
      } else {
        showToast('Galereyaga saqlash uchun ruxsat berilmadi', 'error');
      }
    } catch (error) {
      console.warn(error);
      showToast("Galereyaga saqlab bo'lmadi. “Ulashish” orqali saqlab ko'ring", 'error');
    }
  };

  const handleShare = async () => {
    try {
      const result = await shareImage(drawing.imageUri, drawing.name);
      if (result === 'unavailable') {
        showToast("Bu qurilmada ulashish imkoniyati yo'q", 'error');
      }
    } catch (error) {
      console.warn(error);
      showToast('Ulashishda xatolik yuz berdi', 'error');
    }
  };

  const openRename = async () => {
    const all = await getAllDrawings();
    setOtherNames(all.filter((d) => d.id !== drawing.id).map((d) => d.name));
    setDialog('rename');
  };

  const handleRename = async (name: string) => {
    await renameDrawing(drawing.id, name);
    setDialog('none');
    showToast("Nomi o'zgartirildi", 'success');
    load();
  };

  const handleDelete = async () => {
    await deleteDrawing(drawing.id);
    setDialog('none');
    showToast("Rasm o'chirildi");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isLandscape && styles.contentRow,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <View style={[styles.frame, isLandscape && styles.frameLandscape]}>
          <View style={styles.imageClip}>
            <Image
              source={{ uri: drawing.imageUri }}
              style={[styles.image, { aspectRatio: aspect }]}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={[styles.details, isLandscape && styles.detailsLandscape]}>
          <AppText weight="extrabold" size={24} style={styles.title}>
            {drawing.name}
          </AppText>
          <View style={styles.chips}>
            <Chip icon="calendar-blank-outline" text={formatDateTime(drawing.createdAt)} />
            <Chip icon="layers-outline" text={`${drawing.strokeCount} obyekt`} />
            <Chip icon="file-image-outline" text="PNG" />
          </View>

          <GradientButton
            label="Tahrirlashda ochish"
            icon="pencil-outline"
            onPress={() => navigation.popTo('Canvas', { openDrawingId: drawing.id })}
            style={styles.primary}
          />

          <View style={styles.tiles}>
            <ActionTile
              icon="download-outline"
              label={Platform.OS === 'web' ? 'Yuklab olish' : 'Galereyaga'}
              onPress={handleGallery}
            />
            <ActionTile icon="share-variant-outline" label="Ulashish" onPress={handleShare} />
            <ActionTile icon="form-textbox" label="Nomlash" onPress={openRename} />
            <ActionTile
              icon="trash-can-outline"
              label="O'chirish"
              danger
              onPress={() => setDialog('delete')}
            />
          </View>
        </View>
      </ScrollView>

      <AppModal
        visible={dialog === 'delete'}
        icon="trash-can-outline"
        tone="danger"
        title="Rasmni o'chirish"
        message={`“${drawing.name}” butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.`}
        onRequestClose={() => setDialog('none')}
        actions={[
          { label: 'Bekor qilish', onPress: () => setDialog('none') },
          { label: "O'chirish", onPress: handleDelete, variant: 'danger' },
        ]}
      />

      <NameInputModal
        visible={dialog === 'rename'}
        title="Nomini o'zgartirish"
        icon="form-textbox"
        initialName={drawing.name}
        submitLabel="Saqlash"
        existingNames={otherNames}
        onCancel={() => setDialog('none')}
        onSubmit={handleRename}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  frame: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.canvas,
  },
  frameLandscape: {
    width: '48%',
  },
  imageClip: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.canvas,
  },
  image: {
    width: '100%',
  },
  details: {
    gap: spacing.md,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  detailsLandscape: {
    flex: 1,
  },
  title: {
    letterSpacing: -0.6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primary: {
    marginTop: spacing.sm,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tile: {
    flexGrow: 1,
    flexBasis: '45%',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileDanger: {
    backgroundColor: colors.dangerSoft,
    borderColor: 'rgba(255,93,115,0.25)',
  },
  pressed: {
    opacity: 0.75,
  },
});
