import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../constants/theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

interface Props {
  icon: IconName;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  /** Qiymatni ekranda ko'rsatish (masalan "12 px" yoki "80%"). */
  format: (value: number) => string;
  onChange: (value: number) => void;
  disabled?: boolean;
  testID?: string;
  /** Lenta ichida: nom yashiriladi, faqat ikonka. */
  compact?: boolean;
}

/** Ixcham slayder qatori: ikonka · nom · slayder · qiymat. */
export function SliderRow({
  icon,
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  disabled,
  testID,
  compact,
}: Props) {
  return (
    <View style={[styles.row, disabled && styles.disabled]} testID={testID}>
      <Icon name={icon} size={16} color={colors.textMuted} />
      {!compact && (
        <AppText size={12} weight="medium" color={colors.textMuted} style={styles.label}>
          {label}
        </AppText>
      )}
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        disabled={disabled}
        onValueChange={onChange}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.surfaceHover}
        thumbTintColor="#FFFFFF"
        accessibilityLabel={`${label}: ${format(value)}`}
      />
      <View style={styles.valueBox}>
        <AppText size={12} weight="semibold" style={styles.value}>
          {format(value)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  disabled: {
    opacity: 0.35,
  },
  label: {
    width: 74,
  },
  slider: {
    flex: 1,
    height: 32,
  },
  valueBox: {
    minWidth: 52,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
  },
  value: {
    fontVariant: ['tabular-nums'],
  },
});
