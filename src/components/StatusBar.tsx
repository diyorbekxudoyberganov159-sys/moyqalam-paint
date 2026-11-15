import React from 'react';
import { StyleSheet, View } from 'react-native';

import { TOOL_LABELS } from '../constants/brush';
import { colors, spacing } from '../constants/theme';
import { useCursor } from '../logic/cursorStore';
import { Tool } from '../models/drawing';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

interface Props {
  tool: Tool;
  color: string;
  objectCount: number;
}

function Item({ icon, text, testID }: { icon: IconName; text: string; testID?: string }) {
  return (
    <View style={styles.item} testID={testID}>
      <Icon name={icon} size={13} color={colors.textFaint} />
      <AppText size={11} weight="medium" color={colors.textMuted} style={styles.mono}>
        {text}
      </AppText>
    </View>
  );
}

/**
 * Pastki status satri (Paint'dagidek): joriy asbob, kursor koordinatasi,
 * kanvas o'lchami va obyektlar soni.
 */
export function StatusBar({ tool, color, objectCount }: Props) {
  const { point, size } = useCursor();

  return (
    <View style={styles.bar}>
      <View style={styles.item}>
        <View style={[styles.dot, { backgroundColor: tool === 'eraser' ? colors.canvas : color }]} />
        <AppText size={11} weight="semibold" color={colors.text}>
          {TOOL_LABELS[tool]}
        </AppText>
      </View>
      <Item
        icon="cursor-default-outline"
        text={point ? `${Math.round(point.x)}, ${Math.round(point.y)} px` : '—'}
        testID="status-cursor"
      />
      <Item icon="crop-free" text={`${size.width} × ${size.height}`} />
      <Item icon="layers-outline" text={`${objectCount} obyekt`} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  mono: {
    fontVariant: ['tabular-nums'],
  },
});
