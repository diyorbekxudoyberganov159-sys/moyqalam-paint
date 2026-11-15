import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppModal } from '../components/AppModal';
import { NameInputModal } from '../components/NameInputModal';
import { useToast } from '../components/Toast';
import { colors, radius, spacing } from '../constants/theme';
import {
  deleteDrawing,
  getAllDrawings,
  getDrawing,
  renameDrawing,
} from '../data/drawingRepository';
import { saveToGallery, shareImage } from '../data/imageExport';
import { formatDateTime } from '../logic/format';
import { SavedDrawing } from '../models/drawing';
import { ScreenProps } from '../navigation/types';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function ActionButton(props: { icon: IconName; label: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable
      onPress={props.onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}
    >
      <Ionicons name={props.icon} size={22} color={props.danger ? colors.danger : colors.primary} />
      <Text style={[styles.actionText, props.danger && { color: colors.danger }]}>{props.label}</Text>
    </Pressable>
  );
}

/** Bitta saqlangan rasmni ko'rish: tahrirlash, galereyaga saqlash, ulashish, nomlash, o'chirish. */
export function ViewerScreen({ navigation, route }: ScreenProps<'Viewer'>) {
  const { id } = route.params;
  const [drawing, setDrawing] = useState<SavedDrawing | null | undefined>(undefined);
  const [dialog, setDialog] = useState<'none' | 'delete' | 'rename'>('none');
  const [otherNames, setOtherNames] = useState<string[]>([]);
  const showToast = useToast();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height && width >= 600;

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

  if (drawing === undefined) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (drawing === null) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
        <Text style={styles.missing}>Rasm topilmadi yoki o'chirilgan.</Text>
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
        showToast("Galereyaga saqlash uchun ruxsat berilmadi", 'error');
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
    showToast('Nomi o`zgartirildi', 'success');
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
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <View style={[styles.imageBox, isLandscape && styles.imageBoxLandscape]}>
          <Image source={{ uri: drawing.imageUri }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={[styles.details, isLandscape && styles.detailsLandscape]}>
          <Text style={styles.title}>{drawing.name}</Text>
          <Text style={styles.meta}>
            {formatDateTime(drawing.createdAt)} · {drawing.strokeCount} ta chiziq · PNG
          </Text>

          <View style={styles.actions}>
            <ActionButton
              icon="create-outline"
              label="Tahrirlash"
              onPress={() =>
                navigation.popTo('Canvas', { openDrawingId: drawing.id })
              }
            />
            <ActionButton icon="image-outline" label="Galereyaga" onPress={handleGallery} />
            <ActionButton icon="share-social-outline" label="Ulashish" onPress={handleShare} />
            <ActionButton icon="text-outline" label="Nomlash" onPress={openRename} />
            <ActionButton icon="trash-outline" label="O'chirish" danger onPress={() => setDialog('delete')} />
          </View>
        </View>
      </ScrollView>

      <AppModal
        visible={dialog === 'delete'}
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
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  missing: {
    fontSize: 16,
    color: colors.textMuted,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageBox: {
    backgroundColor: colors.canvas,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    aspectRatio: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  imageBoxLandscape: {
    width: '50%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    gap: spacing.xs,
  },
  detailsLandscape: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  action: {
    flexGrow: 1,
    minWidth: 96,
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});
