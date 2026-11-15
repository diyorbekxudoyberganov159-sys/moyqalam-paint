import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

import { colors, radius, spacing } from '../constants/theme';
import { MAX_NAME_LENGTH, validateDrawingName } from '../logic/validation';
import { AppModal } from './AppModal';

interface Props {
  visible: boolean;
  title: string;
  initialName: string;
  submitLabel: string;
  /** Takroriy nom tekshiruvi uchun mavjud nomlar. */
  existingNames: string[];
  busy?: boolean;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}

/** Rasm nomini kiritish oynasi — nom tekshiriladi, xato bo'lsa qizil matn chiqadi. */
export function NameInputModal({
  visible,
  title,
  initialName,
  submitLabel,
  existingNames,
  busy,
  onCancel,
  onSubmit,
}: Props) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  // Har safar oyna ochilganda maydonni yangilaymiz.
  useEffect(() => {
    if (visible) {
      setName(initialName);
      setError(null);
    }
  }, [visible, initialName]);

  const handleSubmit = () => {
    if (busy) {
      return;
    }
    const validationError = validateDrawingName(name, existingNames);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <AppModal
      visible={visible}
      title={title}
      onRequestClose={onCancel}
      actions={[
        { label: 'Bekor qilish', onPress: onCancel, variant: 'plain' },
        { label: busy ? 'Saqlanmoqda…' : submitLabel, onPress: handleSubmit, variant: 'primary', testID: 'name-submit' },
      ]}
    >
      <TextInput
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (error) {
            setError(null);
          }
        }}
        placeholder="Masalan: Bahor manzarasi"
        placeholderTextColor={colors.textMuted}
        maxLength={MAX_NAME_LENGTH + 10}
        autoFocus
        selectTextOnFocus
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        style={[styles.input, error && styles.inputError]}
        testID="name-input"
      />
      <Text style={[styles.hint, error && styles.errorText]}>
        {error ?? `${name.trim().length}/${MAX_NAME_LENGTH} belgi`}
      </Text>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: -spacing.xs,
  },
  errorText: {
    color: colors.danger,
  },
});
