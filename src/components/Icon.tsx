import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

export type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Ilovadagi barcha ikonkalar bitta to'plamdan (MaterialCommunityIcons) — uslub bir xil bo'ladi. */
export function Icon({ name, size = 22, color }: { name: IconName; size?: number; color: string }) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
