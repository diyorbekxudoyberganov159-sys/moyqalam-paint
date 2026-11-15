import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, gradient, radius, spacing } from '../constants/theme';
import { AppText } from './AppText';
import { GradientButton } from './GradientButton';
import { Icon } from './Icon';
import { IconButton } from './IconButton';

interface Props {
  canUndo: boolean;
  canRedo: boolean;
  /** Tor ekranda "Saqlash" tugmasi faqat ikonka bo'lib qoladi. */
  compact: boolean;
  /** Past ekran: panel ingichkaroq. */
  dense?: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onGallery: () => void;
  onSave: () => void;
}

/** Ilovaning yuqori paneli: logotip, Orqaga/Oldinga, Galereya va Saqlash. */
export function AppBar({ canUndo, canRedo, compact, dense, onUndo, onRedo, onGallery, onSave }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.bar, { paddingTop: insets.top + (dense ? 4 : spacing.sm) }, dense && styles.barDense]}
    >
      <View style={styles.brand}>
        <LinearGradient
          colors={gradient.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logo}
        >
          <Icon name="draw" size={20} color="#fff" />
        </LinearGradient>
        <View>
          <AppText weight="extrabold" size={17} style={styles.title}>
            Mo'yqalam
          </AppText>
          {!dense && (
            <AppText weight="medium" size={10} color={colors.textFaint} style={styles.subtitle}>
              STUDIO
            </AppText>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <IconButton icon="undo-variant" label="Orqaga" onPress={onUndo} disabled={!canUndo} testID="undo" />
        <IconButton icon="redo-variant" label="Oldinga" onPress={onRedo} disabled={!canRedo} testID="redo" />
        <IconButton
          icon="image-multiple-outline"
          label="Mening rasmlarim"
          onPress={onGallery}
          testID="open-gallery"
        />
        <GradientButton
          label={compact ? '' : 'Saqlash'}
          icon="tray-arrow-down"
          onPress={onSave}
          compact
          testID="save"
          style={compact ? styles.saveIcon : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.bg,
  },
  barDense: {
    paddingBottom: 4,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    letterSpacing: -0.4,
    lineHeight: 20,
  },
  subtitle: {
    letterSpacing: 2.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveIcon: {
    width: 40,
  },
});
