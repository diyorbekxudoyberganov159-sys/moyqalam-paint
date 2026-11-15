/**
 * Ilovadagi asosiy ma'lumot modellari.
 * Bu fayl faqat turlarni (type) saqlaydi — hech qanday mantiq yo'q.
 */

/** Kanvasdagi bitta nuqta (piksel koordinatalari). */
export interface Point {
  x: number;
  y: number;
}

/** Chizish asbobi: qalam yoki o'chirg'ich. */
export type Tool = 'pen' | 'eraser';

/**
 * Bitta chiziq (barmoqni qo'yib, ko'targunga qadar chizilgan iz).
 * O'chirg'ich ham chiziq sifatida saqlanadi, faqat u fon rangida chiziladi.
 */
export interface Stroke {
  id: string;
  tool: Tool;
  color: string;
  width: number;
  points: Point[];
}

/** Saqlangan rasm haqidagi ma'lumot (galereyada ko'rsatiladi). */
export interface SavedDrawing {
  id: string;
  name: string;
  /** PNG fayl manzili (telefonda file://..., webda data:image/png...). */
  imageUri: string;
  createdAt: number;
  strokeCount: number;
}

/** Foydalanuvchi sozlamalari — ilova qayta ochilganda tiklanadi. */
export interface BrushSettings {
  tool: Tool;
  color: string;
  penWidth: number;
  eraserWidth: number;
}
