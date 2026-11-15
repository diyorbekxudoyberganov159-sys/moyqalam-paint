import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../components/AppText';
import { GradientButton } from '../components/GradientButton';
import { Icon } from '../components/Icon';
import { TextField } from '../components/TextField';
import { colors, radius, shadow, spacing } from '../constants/theme';
import { getAllDrawings } from '../data/drawingRepository';
import { formatDateTime } from '../logic/format';
import { SavedDrawing } from '../models/drawing';
import { ScreenProps } from '../navigation/types';

const CARD_MIN_WIDTH = 170;

/** Saqlangan rasmlar: qidiruv + to'r ko'rinishidagi kartochkalar. */
export function GalleryScreen({ navigation }: ScreenProps<'Gallery'>) {
  const [drawings, setDrawings] = useState<SavedDrawing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? drawings.filter((d) => d.name.toLowerCase().includes(q)) : drawings;
  }, [drawings, query]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (drawings.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyIcon}>
          <Icon name="image-filter-hdr" size={40} color={colors.accent} />
        </View>
        <AppText weight="bold" size={20}>
          Hali saqlangan rasm yo'q
        </AppText>
        <AppText size={14} color={colors.textMuted} style={styles.centerText}>
          Rasm chizing va yuqoridagi “Saqlash” tugmasini bosing — u shu yerda paydo bo'ladi.
        </AppText>
        <GradientButton
          label="Chizishni boshlash"
          icon="brush"
          onPress={() => navigation.goBack()}
          style={styles.emptyButton}
        />
      </View>
    );
  }

  return (
    <FlatList
      key={numColumns}
      data={filtered}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      style={styles.list}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + spacing.xl }]}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <AppText weight="extrabold" size={26} style={styles.headline}>
              Mening rasmlarim
            </AppText>
            <View style={styles.countChip}>
              <AppText weight="semibold" size={12} color={colors.accent}>
                {drawings.length} ta
              </AppText>
            </View>
          </View>
          <View>
            <View style={styles.searchIcon} pointerEvents="none">
              <Icon name="magnify" size={20} color={colors.textFaint} />
            </View>
            <TextField
              value={query}
              onChangeText={setQuery}
              placeholder="Nomi bo'yicha qidirish"
              style={styles.search}
              returnKeyType="search"
              testID="gallery-search"
            />
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.noResults}>
          <Icon name="file-search-outline" size={32} color={colors.textFaint} />
          <AppText color={colors.textMuted}>“{query.trim()}” bo'yicha hech narsa topilmadi</AppText>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [
            styles.cell,
            { maxWidth: `${100 / numColumns}%` },
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.navigate('Viewer', { id: item.id })}
          accessibilityRole="button"
          accessibilityLabel={item.name}
        >
          <View style={styles.card}>
            <View style={styles.thumbBox}>
              <Image source={{ uri: item.imageUri }} style={styles.thumb} resizeMode="contain" />
            </View>
            <View style={styles.cardText}>
              <AppText weight="semibold" size={14} numberOfLines={1}>
                {item.name}
              </AppText>
              <View style={styles.metaRow}>
                <AppText size={11} color={colors.textFaint}>
                  {formatDateTime(item.createdAt)}
                </AppText>
                <View style={styles.badge}>
                  <Icon name="layers-outline" size={11} color={colors.textMuted} />
                  <AppText size={10} weight="semibold" color={colors.textMuted}>
                    {item.strokeCount}
                  </AppText>
                </View>
              </View>
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
    padding: spacing.xxl,
    gap: spacing.sm,
    backgroundColor: colors.bg,
  },
  centerText: {
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 320,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: radius.xl,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyButton: {
    marginTop: spacing.lg,
  },
  list: {
    backgroundColor: colors.bg,
  },
  listContent: {
    padding: spacing.sm,
  },
  header: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headline: {
    letterSpacing: -0.8,
  },
  countChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.round,
    backgroundColor: colors.accentSoft,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  search: {
    paddingLeft: 40,
    paddingVertical: 10,
    fontSize: 15,
  },
  noResults: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
  },
  cell: {
    flex: 1,
    padding: spacing.xs + 2,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    ...shadow.card,
  },
  thumbBox: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.canvas,
  },
  thumb: {
    width: '100%',
    aspectRatio: 0.85,
  },
  cardText: {
    paddingHorizontal: 4,
    paddingTop: spacing.sm,
    paddingBottom: 2,
    gap: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.round,
    backgroundColor: colors.surfaceRaised,
  },
});
