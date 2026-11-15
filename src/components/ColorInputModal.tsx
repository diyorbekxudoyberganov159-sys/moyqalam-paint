import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing } from '../constants/theme';
import { isValidHexColor } from '../logic/validation';
import { AppModal } from './AppModal';

interface Props {
  visible: boolean;
  initialColor: string;
  onCancel: () => void;
  onSubmit: (color: string) => void;
}

/** Istalgan rangni HEX kod bilan kiritish (#FF8800). Noto'g'ri kod qabul qilinmaydi. */
export function ColorInputModal({ visible, initialColor, onCancel, onSubmit }: Props) {
  const [value, setValue] = useState(initialColor);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setValue(initialColor);
      setError(null);
    }
  }, [visible, initialColor]);

  const normalized = value.trim().startsWith('#') ? value.trim() : `#${value.trim()}`;
  const isValid = isValidHexColor(normalized);

  const handleSubmit = () => {
    if (!isValid) {
      setError("Noto'g'ri rang kodi. Namuna: #FF8800 yoki #F80");
      return;
    }
    onSubmit(normalized.toUpperCase());
  };

  return (
    <AppModal
      visible={visible}
      title="Boshqa rang"
      message="Rangning HEX kodini kiriting."
      onRequestClose={onCancel}
      actions={[
        { label: 'Bekor qilish', onPress: onCancel },
        { label: 'Tanlash', onPress: handleSubmit, variant: 'primary' },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.preview, { backgroundColor: isValid ? normalized : colors.background }]}>
          {!isValid && <Text style={styles.question}>?</Text>}
        </View>
        <TextInput
          value={value}
          onChangeText={(text) => {
            setValue(text);
            setError(null);
          }}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={7}
          placeholder="#FF8800"
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={handleSubmit}
          style={[styles.input, error && styles.inputError]}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </AppModal>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  preview: {
    width: 44,
    height: 44,
    borderRadius: radius.round,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    color: colors.textMuted,
    fontSize: 18,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    fontFamily: 'monospace',
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
});
