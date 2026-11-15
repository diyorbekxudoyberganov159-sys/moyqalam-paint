import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '../constants/theme';

type ToastType = 'info' | 'success' | 'error';

interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

const ToastContext = createContext<(text: string, type?: ToastType) => void>(() => {});

/** Qisqa xabar (masalan "Saqlandi") ko'rsatish uchun: const showToast = useToast(); */
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const show = useCallback((text: string, type: ToastType = 'info') => {
    setMessage({ id: Date.now(), text, type });
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }).start(() =>
        setMessage((current) => (current?.id === message.id ? null : current)),
      );
    }, 2600);
    return () => clearTimeout(timer);
  }, [message, opacity]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message && (
        <Animated.View
          pointerEvents="none"
          style={[styles.toast, styles[message.type], { opacity, top: insets.top + 64 }]}
        >
          <Text style={styles.text}>{message.text}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '90%',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.round,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  info: { backgroundColor: colors.text },
  success: { backgroundColor: colors.success },
  error: { backgroundColor: colors.danger },
  text: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
