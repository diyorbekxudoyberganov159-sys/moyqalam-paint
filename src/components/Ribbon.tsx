import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';

import { TOOL_LABELS } from '../constants/brush';
import { colors, spacing } from '../constants/theme';
import { tapFeedback } from '../logic/haptics';
import { Tool } from '../models/drawing';
import { AppText } from './AppText';
import { IconName } from './Icon';
import { RibbonButton } from './RibbonButton';

interface Props {
  tool: Tool;
  fillShapes: boolean;
  isEmpty: boolean;
  onToolChange: (tool: Tool) => void;
  onToggleFill: () => void;
  onClear: () => void;
  /** Keng ekranda (planshet/landshaft) o'lcham va ranglar ham lentaga joylashadi — xuddi Paint'dagidek. */
  extraGroups?: { title: string; node: React.ReactNode }[];
  /** Past ekran: guruh nomlari va tugma yozuvlari yashiriladi. */
  dense?: boolean;
}

const TOOL_ICONS: Record<Tool, IconName> = {
  pen: 'pencil',
  marker: 'marker',
  eraser: 'eraser',
  line: 'vector-line',
  rect: 'rectangle-outline',
  ellipse: 'ellipse-outline',
};

/** Lentadagi bitta guruh: tugmalar va pastida guruh nomi (Paint uslubi). */
function Group({
  title,
  children,
  last,
  dense,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
  dense?: boolean;
}) {
  return (
    <View style={[styles.group, dense && styles.groupDense, !last && styles.groupDivider]}>
      <View style={styles.groupItems}>{children}</View>
      {!dense && (
        <AppText size={10} weight="semibold" color={colors.textFaint} style={styles.groupTitle}>
          {title.toUpperCase()}
        </AppText>
      )}
    </View>
  );
}

/** Yuqori asboblar lentasi (ribbon): Asboblar · Shakllar · [O'lcham · Ranglar] · Kanvas. */
export function Ribbon({
  tool,
  fillShapes,
  isEmpty,
  onToolChange,
  onToggleFill,
  onClear,
  extraGroups = [],
  dense,
}: Props) {
  const toolButton = (t: Tool) => (
    <RibbonButton
      dense={dense}
      key={t}
      icon={TOOL_ICONS[t]}
      label={TOOL_LABELS[t] === "To'rtburchak" ? "To'rtb." : TOOL_LABELS[t]}
      active={tool === t}
      onPress={() => {
        tapFeedback();
        onToolChange(t);
      }}
      testID={`tool-${t}`}
    />
  );

  // Tor ekranda lenta suriladi — o'ng chetdagi soya "davomi bor" ekanini ko'rsatadi.
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [layoutWidth, setLayoutWidth] = useState(0);
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    setCanScrollRight(contentOffset.x + layoutMeasurement.width < contentSize.width - 4);
  };

  return (
    <View style={styles.container} onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        onContentSizeChange={(w) => setCanScrollRight(w > layoutWidth + 4)}
      >
        <Group dense={dense} title="Asboblar">
          {(['pen', 'marker', 'eraser'] as Tool[]).map(toolButton)}
        </Group>
        <Group dense={dense} title="Shakllar">
          {(['line', 'rect', 'ellipse'] as Tool[]).map(toolButton)}
          <RibbonButton
            dense={dense}
            icon="format-color-fill"
            label="To'ldirish"
            active={fillShapes}
            onPress={() => {
              tapFeedback();
              onToggleFill();
            }}
            testID="toggle-fill"
          />
        </Group>
        {extraGroups.map((g) => (
          <Group dense={dense} key={g.title} title={g.title}>
            {g.node}
          </Group>
        ))}
        <Group dense={dense} title="Kanvas" last>
          <RibbonButton
            dense={dense}
            icon="delete-sweep-outline"
            label="Tozalash"
            danger
            disabled={isEmpty}
            onPress={onClear}
            testID="clear"
          />
        </Group>
      </ScrollView>
      {canScrollRight && (
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(22,27,38,0)', colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fade}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 40,
  },
  scroll: {
    paddingHorizontal: spacing.sm,
  },
  group: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    alignItems: 'center',
  },
  groupDense: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  groupDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  groupItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  groupTitle: {
    marginTop: 4,
    letterSpacing: 1,
  },
});
