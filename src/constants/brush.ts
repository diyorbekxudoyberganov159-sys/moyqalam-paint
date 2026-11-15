import { BrushSettings, Tool } from '../models/drawing';

/** Tayyor ranglar palitrasi (Paint uslubida — 2 qator). */
export const PALETTE: string[] = [
  '#0F172A', // qora
  '#FFFFFF', // oq
  '#64748B', // kulrang
  '#EF4444', // qizil
  '#F97316', // to'q sariq
  '#F59E0B', // amber
  '#FACC15', // sariq
  '#84CC16', // och yashil
  '#22C55E', // yashil
  '#14B8A6', // feruza
  '#06B6D4', // havorang
  '#3B82F6', // ko'k
  '#6366F1', // indigo
  '#8B5CF6', // binafsha
  '#D946EF', // fuksiya
  '#EC4899', // pushti
  '#92400E', // jigarrang
  '#FDE68A', // krem
];

/** Qalinlik chegaralari. */
export const MIN_WIDTH = 1;
export const MAX_WIDTH = 48;

/** Shaffoflik chegaralari. */
export const MIN_OPACITY = 0.1;
export const MAX_OPACITY = 1;

/** Marker doim yarim shaffof bo'ladi (ustma-ust chizilsa ham ostidagi ko'rinadi). */
export const MARKER_OPACITY_FACTOR = 0.45;

/** Undo tarixida saqlanadigan maksimal qadamlar soni (xotirani tejash uchun). */
export const HISTORY_LIMIT = 100;

/** Kichik shakllar (tasodifiy teginish) e'tiborga olinmaydi. */
export const MIN_SHAPE_SIZE = 4;

export const DEFAULT_SETTINGS: BrushSettings = {
  tool: 'pen',
  color: PALETTE[0],
  penWidth: 6,
  eraserWidth: 28,
  opacity: 1,
  fillShapes: false,
};

/** Asboblarning o'zbekcha nomlari (status satri va tugmalar uchun). */
export const TOOL_LABELS: Record<Tool, string> = {
  pen: 'Qalam',
  marker: 'Marker',
  eraser: "O'chirg'ich",
  line: 'Chiziq',
  rect: "To'rtburchak",
  ellipse: 'Ellips',
};
