import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../constants/theme';
import { buildSpectrum, normalizeHex } from '../logic/color';
import { isValidHexColor } from '../logic/validation';
import { AppModal } from './AppModal';
import { AppText } from './AppText';
import { TextField } from './TextField';

interface Props {
  visible: boolean;
  initialColor: string;
  onCancel: () => void;
  onSubmit: (color: string) => void;
}

/**
 * "Ranglarni tahrirlash" oynasi (Paint'dagi kabi): spektr to'ridan tanlash
 * yoki HEX kodni qo'lda kiritish. Noto'g'ri kod qabul qilinmaydi.
 */
export function ColorInputModal({ visible, initialColor, onCancel, onSubmit }: Props) {
  const [value, setValue] = useState(initialColor);
  const [error, setError] = useState<string | null>(null);
  const spectrum = useMemo(buildSpectrum, []);

  useEffect(() => {
    if (visible) {
      setValue(initialColor);
      setError(null);
    }
  }, [visible, initialColor]);

  const normalized = normalizeHex(value);
  const isValid = isValidHexColor(normalized);

  const handleSubmit = () => {
    if (!isValid) {
      setError("Noto'g'ri rang kodi. Namuna: #FF8800 yoki #F80");
      return;
    }
    onSubmit(normalized);
  };

  return (
    <AppModal
      visible={visible}
      title="Ranglarni tahrirlash"
      icon="palette-outline"
      onRequestClose={onCancel}
      actions={[
        { label: 'Bekor qilish', onPress: onCancel },
        { label: 'Tanlash', onPress: handleSubmit, variant: 'accent', testID: 'color-submit' },
      ]}
    >
      <View style={styles.spectrum}>
        {spectrum.map((row, r) => (
          <View key={r} style={styles.spectrumRow}>
            {row.map((hex) => (
              <Pressable
                key={hex}
                onPress={() => {
                  setValue(hex);
                  setError(null);
                }}
                accessibilityLabel={`Spektr ${hex}`}
                style={[styles.cell, { backgroundColor: hex }, normalized === hex && styles.cellSelected]}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.row}>
        <View style={[styles.preview, { backgroundColor: isValid ? normalized : colors.bg }]}>
          {!isValid && <AppText color={colors.textFaint}>?</AppText>}
        </View>
        <TextField
          value={value}
          onChangeText={(text) => {
            setValue(text);
            setError(null);
          }}
          hasError={!!error}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={7}
          placeholder="#FF8800"
          onSubmitEditing={handleSubmit}
          style={styles.input}
          testID="hex-input"
        />
      </View>
      {error && (
        <AppText size={12} weight="medium" color={colors.danger}>
          {error}
        </AppText>
      )}
    </AppModal>
  );
}

const styles = StyleSheet.create({
  spectrum: {
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  spectrumRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    height: 26,
  },
  cellSelected: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  preview: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    letterSpacing: 1,
  },
});
