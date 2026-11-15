import { BrushSettings } from '../models/drawing';

/** Tayyor ranglar palitrasi. */
export const PALETTE: string[] = [
  '#111827', // qora
  '#6B7280', // kulrang
  '#DC2626', // qizil
  '#F97316', // to'q sariq
  '#FACC15', // sariq
  '#16A34A', // yashil
  '#0EA5E9', // havorang
  '#2563EB', // ko'k
  '#7C3AED', // binafsha
  '#DB2777', // pushti
  '#92400E', // jigarrang
  '#FFFFFF', // oq
];

/** Qalam va o'chirg'ich qalinligi chegaralari. */
export const MIN_WIDTH = 1;
export const MAX_WIDTH = 40;

/** Undo tarixida saqlanadigan maksimal qadamlar soni (xotirani tejash uchun). */
export const HISTORY_LIMIT = 100;

export const DEFAULT_SETTINGS: BrushSettings = {
  tool: 'pen',
  color: PALETTE[0],
  penWidth: 6,
  eraserWidth: 24,
};
