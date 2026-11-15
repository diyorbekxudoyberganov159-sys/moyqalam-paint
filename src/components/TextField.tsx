import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { colors, fonts, radius, spacing } from '../constants/theme';

interface Props extends TextInputProps {
  hasError?: boolean;
}

/** To'q mavzudagi matn kiritish maydoni (xato bo'lsa qizil chegara). */
export function TextField({ hasError, style, ...rest }: Props) {
  return (
    <TextInput
      placeholderTextColor={colors.textFaint}
      selectionColor={colors.accent}
      {...rest}
      style={[styles.input, hasError && styles.error, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  error: {
    borderColor: colors.danger,
  },
});
