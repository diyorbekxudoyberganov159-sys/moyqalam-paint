import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../constants/theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

interface Props {
  icon: IconName;
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
  testID?: string;
  /** Past ekranda (yotiq telefon) faqat ikonka ko'rsatiladi. */
  dense?: boolean;
}

/** Lentadagi (ribbon) asbob tugmasi: ikonka + nom, tanlanganda yorqin chegara bilan ajraladi. */
export function RibbonButton({ icon, label, onPress, active, disabled, danger, testID, dense }: Props) {
  const tint = disabled ? colors.textFaint : active ? colors.text : danger ? colors.danger : colors.textMuted;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active, disabled }}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        dense && styles.dense,
        active && styles.active,
        pressed && !active && !disabled && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, active && styles.iconActive]}>
        <Icon name={icon} size={21} color={active ? '#fff' : tint} />
      </View>
      {!dense && (
        <AppText size={11} weight={active ? 'semibold' : 'medium'} color={tint} numberOfLines={1}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 64,
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 4,
  },
  dense: {
    width: 44,
    paddingVertical: 3,
  },
  active: {
    backgroundColor: colors.accentSoft,
    borderColor: 'rgba(124,108,255,0.55)',
  },
  pressed: {
    backgroundColor: colors.surfaceHover,
  },
  iconWrap: {
    width: 34,
    height: 30,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: colors.accent,
  },
});
