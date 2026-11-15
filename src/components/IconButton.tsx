import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type MciName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Ikonka: Ionicons nomi yoki { mci: '...' } — MaterialCommunityIcons to'plamidan (masalan, o'chirg'ich). */
export type ButtonIcon = IconName | { mci: MciName };

interface Props {
  icon: ButtonIcon;
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
  testID?: string;
  /** Landshaft paneldagi 3 ustunli to'r uchun. */
  grid?: boolean;
}

/** Asboblar panelidagi belgili tugma (ikonka + qisqa yozuv). */
export function IconButton({ icon, label, onPress, active, disabled, danger, testID, grid }: Props) {
  const tint = disabled ? colors.disabled : active ? colors.surface : danger ? colors.danger : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected: active }}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        grid && styles.grid,
        active && styles.active,
        pressed && !disabled && !active && styles.pressed,
      ]}
    >
      <View style={styles.inner}>
        {typeof icon === 'string' ? (
          <Ionicons name={icon} size={22} color={tint} />
        ) : (
          <MaterialCommunityIcons name={icon.mci} size={22} color={tint} />
        )}
        <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 52,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    width: '32%',
    paddingVertical: spacing.sm,
  },
  inner: {
    alignItems: 'center',
  },
  active: {
    backgroundColor: colors.primary,
  },
  pressed: {
    backgroundColor: colors.primaryLight,
  },
  label: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
});
