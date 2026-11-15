import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '../constants/theme';
import { getAllDrawings } from '../data/drawingRepository';
import { formatDateTime } from '../logic/format';
import { SavedDrawing } from '../models/drawing';
import { ScreenProps } from '../navigation/types';

const CARD_MIN_WIDTH = 160;

/** Saqlangan rasmlar ro'yxati (to'r ko'rinishida). */
export function GalleryScreen({ navigation }: ScreenProps<'Gallery'>) {
  const [drawings, setDrawings] = useState<SavedDrawing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Ekran kengligiga qarab ustunlar soni: telefonda 2, planshet/landshaftda 3–5.
  const numColumns = Math.max(2, Math.min(5, Math.floor(width / CARD_MIN_WIDTH)));

  // Ekranga har qaytilganda ro'yxatni yangilaymiz (o'chirish/nomlashdan keyin).
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getAllDrawings().then((list) => {
        if (active) {
          setDrawings(list);
          setIsLoading(false);
        }
      });
      return () => {
        active = false;
      };
    }, []),
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (drawings.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="color-palette-outline" size={64} color={colors.disabled} />
        <Text style={styles.emptyTitle}>Hali saqlangan rasm yo'q</Text>
        <Text style={styles.emptyText}>Rasm chizing va “Saqlash” tugmasini bosing.</Text>
        <Pressable style={styles.emptyButton} onPress={() => navigation.goBack()}>
          <Text style={styles.emptyButtonText}>Chizishni boshlash</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      key={numColumns}
      data={drawings}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.lg }]}
      ListHeaderComponent={<Text style={styles.count}>Jami: {drawings.length} ta rasm</Text>}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.card, { maxWidth: `${100 / numColumns}%` }, pressed && styles.pressed]}
          onPress={() => navigation.navigate('Viewer', { id: item.id })}
          accessibilityRole="button"
          accessibilityLabel={item.name}
        >
          <View style={styles.cardInner}>
            <Image source={{ uri: item.imageUri }} style={styles.thumb} resizeMode="contain" />
            <View style={styles.cardText}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.date}>{formatDateTime(item.createdAt)}</Text>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.round,
  },
  emptyButtonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 15,
  },
  list: {
    padding: spacing.sm,
  },
  count: {
    color: colors.textMuted,
    fontSize: 13,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  card: {
    flex: 1,
    padding: spacing.xs + 2,
  },
  pressed: {
    opacity: 0.75,
  },
  cardInner: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.canvas,
  },
  cardText: {
    padding: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
