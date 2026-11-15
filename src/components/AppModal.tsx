import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, shadow, spacing } from '../constants/theme';
import { AppText } from './AppText';
import { GradientButton } from './GradientButton';
import { Icon, IconName } from './Icon';

export interface ModalAction {
  label: string;
  onPress: () => void;
  variant?: 'accent' | 'danger' | 'ghost';
  testID?: string;
}

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  icon?: IconName;
  tone?: 'accent' | 'danger';
  actions: ModalAction[];
  onRequestClose: () => void;
  children?: React.ReactNode;
}

/**
 * Umumiy dialog oynasi. Alert.alert o'rniga ishlatiladi, chunki u
 * Android, iOS va webda bir xil ko'rinadi va ichiga TextInput qo'yish mumkin.
 */
export function AppModal({
  visible,
  title,
  message,
  icon,
  tone = 'accent',
  actions,
  onRequestClose,
  children,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <KeyboardAvoidingView style={styles.backdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} accessibilityLabel="Yopish" />
        <View style={styles.card}>
          {icon && (
            <View style={[styles.badge, tone === 'danger' && styles.badgeDanger]}>
              <Icon name={icon} size={22} color={tone === 'danger' ? colors.danger : colors.accent} />
            </View>
          )}
          <AppText weight="bold" size={19}>
            {title}
          </AppText>
          {message ? (
            <AppText size={14} color={colors.textMuted} style={styles.message}>
              {message}
            </AppText>
          ) : null}
          {children}
          <View style={styles.actions}>
            {actions.map((action) => (
              <GradientButton
                key={action.label}
                label={action.label}
                onPress={action.onPress}
                variant={action.variant ?? 'ghost'}
                compact
                testID={action.testID}
              />
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow.card,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDanger: {
    backgroundColor: colors.dangerSoft,
  },
  message: {
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
