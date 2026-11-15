import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { colors } from '../constants/theme';
import { MAX_NAME_LENGTH, validateDrawingName } from '../logic/validation';
import { AppModal } from './AppModal';
import { AppText } from './AppText';
import { IconName } from './Icon';
import { TextField } from './TextField';

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  icon?: IconName;
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
  message,
  icon = 'content-save-outline',
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
      message={message}
      icon={icon}
      onRequestClose={onCancel}
      actions={[
        { label: 'Bekor qilish', onPress: onCancel },
        {
          label: busy ? 'Saqlanmoqda…' : submitLabel,
          onPress: handleSubmit,
          variant: 'accent',
          testID: 'name-submit',
        },
      ]}
    >
      <TextField
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (error) {
            setError(null);
          }
        }}
        hasError={!!error}
        placeholder="Masalan: Bahor manzarasi"
        maxLength={MAX_NAME_LENGTH + 10}
        autoFocus
        selectTextOnFocus
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        testID="name-input"
      />
      <AppText size={12} weight="medium" color={error ? colors.danger : colors.textFaint} style={styles.hint}>
        {error ?? `${name.trim().length}/${MAX_NAME_LENGTH} belgi`}
      </AppText>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: -4,
  },
});
