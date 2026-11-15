import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, radius } from '../constants/theme';
import { Icon, IconName } from './Icon';

interface Props {
  icon: IconName;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  testID?: string;
}

/** Yumaloq ikonka-tugma (yuqori paneldagi Orqaga/Oldinga/Galereya). */
export function IconButton({ icon, label, onPress, disabled, size = 40, testID }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      testID={testID}
      hitSlop={6}
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size },
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Icon name={icon} size={20} color={disabled ? colors.textFaint : colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.surfaceHover,
  },
});
