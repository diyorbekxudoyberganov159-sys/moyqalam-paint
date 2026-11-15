import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { PALETTE } from '../constants/brush';
import { colors, radius, spacing } from '../constants/theme';
import { tapFeedback } from '../logic/haptics';
import { Icon } from './Icon';

interface Props {
  selected: string;
  /** O'chirg'ich tanlanganda palitra xira ko'rinadi. */
  dimmed?: boolean;
  /** 'row' — bitta qator (telefon), 'grid' — 2 qatorli to'r (lenta ichida, Paint kabi). */
  layout?: 'row' | 'grid';
  onSelect: (color: string) => void;
  onCustomPress: () => void;
}

/** Rang palitrasi + "boshqa rang" (HEX) tugmasi. */
export function ColorPalette({ selected, dimmed, layout = 'row', onSelect, onCustomPress }: Props) {
  const grid = layout === 'grid';
  const size = grid ? 22 : 30;
  const isCustom = !PALETTE.includes(selected.toUpperCase());

  const swatches = PALETTE.map((color) => {
    const isSelected = !dimmed && color.toUpperCase() === selected.toUpperCase();
    return (
      <Pressable
        key={color}
        onPress={() => {
          tapFeedback();
          onSelect(color);
        }}
        accessibilityRole="button"
        accessibilityLabel={`Rang ${color}`}
        style={[styles.ring, isSelected && styles.ringSelected, { borderRadius: radius.round }]}
      >
        <View
          style={[
            { width: size, height: size, borderRadius: radius.round, backgroundColor: color },
            styles.swatchEdge,
          ]}
        />
      </Pressable>
    );
  });

  const custom = (
    <Pressable
      key="custom"
      onPress={onCustomPress}
      accessibilityRole="button"
      accessibilityLabel="Boshqa rang"
      style={[styles.ring, isCustom && !dimmed && styles.ringSelected]}
    >
      <View
        style={[
          styles.custom,
          { width: size, height: size },
          isCustom && { backgroundColor: selected, borderStyle: 'solid' },
        ]}
      >
        {!isCustom && <Icon name="plus" size={grid ? 14 : 18} color={colors.textMuted} />}
      </View>
    </Pressable>
  );

  if (grid) {
    const half = Math.ceil(PALETTE.length / 2);
    return (
      <View style={[styles.grid, dimmed && styles.dimmed]}>
        <View style={styles.gridRow}>{swatches.slice(0, half)}</View>
        <View style={styles.gridRow}>
          {swatches.slice(half)}
          {custom}
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={dimmed && styles.dimmed}
    >
      {swatches}
      {custom}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  grid: {
    gap: 0,
  },
  gridRow: {
    flexDirection: 'row',
  },
  dimmed: {
    opacity: 0.35,
  },
  ring: {
    padding: 2,
    margin: 1,
    borderRadius: radius.round,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ringSelected: {
    borderColor: colors.accent,
  },
  swatchEdge: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  custom: {
    borderRadius: radius.round,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.textFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
