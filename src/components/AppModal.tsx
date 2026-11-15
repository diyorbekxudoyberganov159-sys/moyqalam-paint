import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, radius, spacing } from '../constants/theme';

export interface ModalAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'plain';
  testID?: string;
}

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  actions: ModalAction[];
  onRequestClose: () => void;
  children?: React.ReactNode;
}

/**
 * Umumiy dialog oynasi. Alert.alert o'rniga ishlatiladi, chunki u
 * Android, iOS va webda bir xil ko'rinadi va ichiga TextInput qo'yish mumkin.
 */
export function AppModal({ visible, title, message, actions, onRequestClose, children }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} accessibilityLabel="Yopish" />
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          {children}
          <View style={styles.actions}>
            {actions.map((action) => (
              <Pressable
                key={action.label}
                onPress={action.onPress}
                testID={action.testID}
                style={({ pressed }) => [
                  styles.action,
                  action.variant === 'primary' && styles.primary,
                  action.variant === 'danger' && styles.danger,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.actionText,
                    (action.variant === 'primary' || action.variant === 'danger') && styles.actionTextLight,
                  ]}
                >
                  {action.label}
                </Text>
              </Pressable>
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
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  message: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  action: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  pressed: {
    opacity: 0.8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  actionTextLight: {
    color: colors.surface,
  },
});
