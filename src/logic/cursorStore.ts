import { useSyncExternalStore } from 'react';

import { Point } from '../models/drawing';

/**
 * Kursor (barmoq) koordinatasi va kanvas o'lchami uchun kichik "store".
 * Status satri har siljishda yangilanadi, lekin butun ekran qayta chizilmaydi —
 * faqat shu qiymatga obuna bo'lgan komponent yangilanadi.
 */
interface CursorState {
  point: Point | null;
  size: { width: number; height: number };
}

let state: CursorState = { point: null, size: { width: 0, height: 0 } };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const cursorStore = {
  setPoint(point: Point | null) {
    state = { ...state, point };
    emit();
  },
  setSize(width: number, height: number) {
    state = { ...state, size: { width: Math.round(width), height: Math.round(height) } };
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => state,
};

export function useCursor(): CursorState {
  return useSyncExternalStore(cursorStore.subscribe, cursorStore.getSnapshot, cursorStore.getSnapshot);
}
