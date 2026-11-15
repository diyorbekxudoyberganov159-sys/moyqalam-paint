import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, shadow, spacing } from '../constants/theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

type ToastType = 'info' | 'success' | 'error';

interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

const ICONS: Record<ToastType, { name: IconName; color: string }> = {
  info: { name: 'information-outline', color: colors.accent2 },
  success: { name: 'check-circle', color: colors.success },
  error: { name: 'alert-circle', color: colors.danger },
};

const ToastContext = createContext<(text: string, type?: ToastType) => void>(() => {});

/** Qisqa xabar (masalan "Saqlandi") ko'rsatish uchun: const showToast = useToast(); */
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const anim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const show = useCallback((text: string, type: ToastType = 'info') => {
    setMessage({ id: Date.now(), text, type });
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
    const timer = setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() =>
        setMessage((current) => (current?.id === message.id ? null : current)),
      );
    }, 2600);
    return () => clearTimeout(timer);
  }, [message, anim]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              top: insets.top + 12,
              opacity: anim,
              transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
            },
          ]}
        >
          <View style={styles.row}>
            <Icon name={ICONS[message.type].name} size={18} color={ICONS[message.type].color} />
            <AppText weight="semibold" size={14} style={styles.text}>
              {message.text}
            </AppText>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '92%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.round,
    backgroundColor: 'rgba(29,36,51,0.97)',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    ...shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  text: {
    flexShrink: 1,
  },
});
