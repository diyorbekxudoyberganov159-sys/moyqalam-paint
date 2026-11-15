import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MAX_WIDTH, MIN_WIDTH } from '../constants/brush';
import { colors, spacing } from '../constants/theme';

interface Props {
  value: number;
  color: string;
  label: string;
  onChange: (value: number) => void;
}

/** Qalinlik tanlash: slayder + qalinlik namunasi (doiracha) + son. */
export function WidthSelector({ value, color, label, onChange }: Props) {
  const previewSize = Math.max(value, 2);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Slider
        style={styles.slider}
        minimumValue={MIN_WIDTH}
        maximumValue={MAX_WIDTH}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
        accessibilityLabel={`${label}: ${value}`}
      />
      <View style={styles.previewBox}>
        <View
          style={[
            styles.preview,
            {
              width: previewSize,
              height: previewSize,
              borderRadius: previewSize / 2,
              backgroundColor: color,
            },
            color.toUpperCase() === '#FFFFFF' && styles.previewWhite,
          ]}
        />
      </View>
      <Text style={styles.value}>{value}px</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    width: 72,
  },
  slider: {
    flex: 1,
    height: 36,
  },
  previewBox: {
    width: MAX_WIDTH + 4,
    height: MAX_WIDTH + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {},
  previewWhite: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  value: {
    width: 40,
    textAlign: 'right',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
    color: colors.text,
  },
});
