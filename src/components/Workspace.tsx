import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

import { colors } from '../constants/theme';

/**
 * Kanvas orqasidagi ish maydoni: to'q fon ustida nozik nuqtali to'r
 * (grafik dasturlardagi kabi). Faqat bezak — PNG ga tushmaydi.
 */
export function Workspace({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <Pattern id="dots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
            <Circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.07)" />
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.workspace,
  },
});
