import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { colors, fonts } from '../constants/theme';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

interface Props extends TextProps {
  weight?: Weight;
  size?: number;
  color?: string;
}

/** Inter shriftidagi matn — ilovadagi barcha yozuvlar shu komponent orqali. */
export function AppText({ weight = 'regular', size = 14, color = colors.text, style, ...rest }: Props) {
  return (
    <Text {...rest} style={[styles.base, { fontFamily: fonts[weight], fontSize: size, color }, style]} />
  );
}

const styles = StyleSheet.create({
  base: {
    letterSpacing: -0.1,
  },
});
