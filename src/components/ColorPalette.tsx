import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { PALETTE } from '../constants/brush';
import { colors, radius, spacing } from '../constants/theme';

interface Props {
  selected: string;
  /** O'chirg'ich tanlanganda palitra xira ko'rinadi. */
  dimmed?: boolean;
  /** true — ranglar bir necha qatorga o'raladi (landshaft rejim). */
  wrap?: boolean;
  onSelect: (color: string) => void;
  onCustomPress: () => void;
}

const SWATCH = 30;

/** Rang tanlash: tayyor ranglar + "boshqa rang" (HEX kiritish) tugmasi. */
export function ColorPalette({ selected, dimmed, wrap, onSelect, onCustomPress }: Props) {
  const isCustom = !PALETTE.includes(selected.toUpperCase());

  const content = (
    <View style={[styles.row, wrap && styles.wrap, dimmed && styles.dimmed]}>
      {PALETTE.map((color) => {
        const isSelected = !dimmed && color.toUpperCase() === selected.toUpperCase();
        return (
          <Pressable
            key={color}
            onPress={() => onSelect(color)}
            accessibilityRole="button"
            accessibilityLabel={`Rang ${color}`}
            style={[styles.swatchOuter, isSelected && styles.swatchSelected]}
          >
            <View
              style={[
                styles.swatch,
                { backgroundColor: color },
                color === '#FFFFFF' && styles.whiteSwatch,
              ]}
            />
          </Pressable>
        );
      })}
      <Pressable
        onPress={onCustomPress}
        accessibilityRole="button"
        accessibilityLabel="Boshqa rang"
        style={[styles.swatchOuter, isCustom && !dimmed && styles.swatchSelected]}
      >
        <View style={[styles.swatch, styles.customSwatch, isCustom && { backgroundColor: selected }]}>
          {!isCustom && <Ionicons name="add" size={18} color={colors.textMuted} />}
        </View>
      </Pressable>
    </View>
  );

  if (wrap) {
    return content;
  }
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrap: {
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dimmed: {
    opacity: 0.35,
  },
  swatchOuter: {
    padding: 3,
    margin: 2,
    borderRadius: radius.round,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: colors.primary,
  },
  swatch: {
    width: SWATCH,
    height: SWATCH,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteSwatch: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  customSwatch: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.textMuted,
    backgroundColor: colors.surface,
  },
});
