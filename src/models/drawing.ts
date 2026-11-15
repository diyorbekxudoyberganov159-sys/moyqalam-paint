/**
 * Ilovadagi asosiy ma'lumot modellari.
 * Bu fayl faqat turlarni (type) saqlaydi — hech qanday mantiq yo'q.
 */

/** Kanvasdagi bitta nuqta (piksel koordinatalari). */
export interface Point {
  x: number;
  y: number;
}

/** Erkin chizish asboblari — barmoq izi bo'yicha chiziladi. */
export type FreehandTool = 'pen' | 'marker' | 'eraser';

/** Shakl asboblari — boshlang'ich va oxirgi nuqta bo'yicha chiziladi. */
export type ShapeTool = 'line' | 'rect' | 'ellipse';

/** Chizish asbobi. */
export type Tool = FreehandTool | ShapeTool;

export const SHAPE_TOOLS: ShapeTool[] = ['line', 'rect', 'ellipse'];

export const isShapeTool = (tool: Tool): tool is ShapeTool => (SHAPE_TOOLS as Tool[]).includes(tool);

/**
 * Kanvasdagi bitta obyekt: erkin chiziq yoki shakl.
 *  - erkin chiziqda `points` — barmoq izi;
 *  - shaklda `points` — [boshlang'ich nuqta, oxirgi nuqta].
 * O'chirg'ich ham obyekt sifatida saqlanadi — u fon rangida chiziladi.
 */
export interface Stroke {
  id: string;
  tool: Tool;
  color: string;
  width: number;
  /** 0.1 … 1 (1 — to'liq ko'rinadi). */
  opacity: number;
  /** To'rtburchak va ellips ichini bo'yash. */
  fill: boolean;
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
  /** Qalam, marker va shakllar qalinligi. */
  penWidth: number;
  eraserWidth: number;
  opacity: number;
  fillShapes: boolean;
}
