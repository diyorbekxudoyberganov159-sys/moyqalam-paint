import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, gradient, radius, spacing } from '../constants/theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

interface Props {
  label: string;
  icon?: IconName;
  onPress: () => void;
  variant?: 'accent' | 'danger' | 'ghost';
  compact?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

/** Asosiy harakat tugmasi: gradient fon (accent/danger) yoki shaffof (ghost). */
export function GradientButton({
  label,
  icon,
  onPress,
  variant = 'accent',
  compact,
  disabled,
  style,
  testID,
}: Props) {
  const content = (
    <View style={[styles.inner, compact && styles.compact]}>
      {icon && (
        <Icon name={icon} size={compact ? 18 : 20} color={variant === 'ghost' ? colors.text : '#fff'} />
      )}
      <AppText weight="semibold" size={compact ? 14 : 15} color={variant === 'ghost' ? colors.text : '#fff'}>
        {label}
      </AppText>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        style,
        (pressed || disabled) && { opacity: disabled ? 0.4 : 0.85 },
      ]}
    >
      {variant === 'ghost' ? (
        <View style={styles.ghost}>{content}</View>
      ) : (
        <LinearGradient
          colors={variant === 'danger' ? gradient.danger : gradient.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.round,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: radius.round,
  },
  ghost: {
    borderRadius: radius.round,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  compact: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    gap: 6,
  },
});
