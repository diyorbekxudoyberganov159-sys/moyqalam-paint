import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../constants/theme';
import { BrushSettings, Tool } from '../models/drawing';
import { ColorPalette } from './ColorPalette';
import { IconButton } from './IconButton';
import { WidthSelector } from './WidthSelector';

interface Props {
  settings: BrushSettings;
  activeWidth: number;
  canUndo: boolean;
  canRedo: boolean;
  isEmpty: boolean;
  /** Landshaft rejimda panel o'ng tomonda, ustun ko'rinishida chiqadi. */
  vertical?: boolean;
  onToolChange: (tool: Tool) => void;
  onColorChange: (color: string) => void;
  onCustomColor: () => void;
  onWidthChange: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
}

/** Barcha chizish asboblari bitta panelda. */
export function Toolbar(props: Props) {
  const { settings, vertical } = props;
  const isEraser = settings.tool === 'eraser';

  return (
    <View style={[styles.container, vertical && styles.vertical]}>
      <View style={[styles.actions, vertical && styles.actionsWrap]}>
        <IconButton
          grid={vertical}
          icon="brush"
          label="Qalam"
          active={settings.tool === 'pen'}
          onPress={() => props.onToolChange('pen')}
          testID="tool-pen"
        />
        <IconButton
          grid={vertical}
          icon={{ mci: 'eraser' }}
          label="O'chirg'ich"
          active={isEraser}
          onPress={() => props.onToolChange('eraser')}
          testID="tool-eraser"
        />
        {!vertical && <View style={styles.divider} />}
        <IconButton
          grid={vertical}
          icon="arrow-undo"
          label="Orqaga"
          disabled={!props.canUndo}
          onPress={props.onUndo}
          testID="undo"
        />
        <IconButton
          grid={vertical}
          icon="arrow-redo"
          label="Oldinga"
          disabled={!props.canRedo}
          onPress={props.onRedo}
          testID="redo"
        />
        {!vertical && <View style={styles.divider} />}
        <IconButton
          grid={vertical}
          icon="trash-outline"
          label="Tozalash"
          danger
          disabled={props.isEmpty}
          onPress={props.onClear}
          testID="clear"
        />
        <IconButton grid={vertical} icon="download-outline" label="Saqlash" onPress={props.onSave} testID="save" />
      </View>

      <ColorPalette
        selected={settings.color}
        dimmed={isEraser}
        wrap={vertical}
        onSelect={props.onColorChange}
        onCustomPress={props.onCustomColor}
      />

      <WidthSelector
        label={isEraser ? "O'chirg'ich" : 'Qalinlik'}
        value={props.activeWidth}
        color={isEraser ? colors.textMuted : settings.color}
        onChange={props.onWidthChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.xs,
    gap: spacing.xs,
  },
  vertical: {
    borderTopWidth: 0,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xs,
  },
  actionsWrap: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.xs,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
    backgroundColor: colors.border,
  },
});
