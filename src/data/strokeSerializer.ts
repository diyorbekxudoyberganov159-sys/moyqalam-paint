import { Stroke } from '../models/drawing';

/**
 * Chiziqlarni JSON ga yozish/o'qish.
 * O'qishda har bir chiziq tekshiriladi: noto'g'ri yozuvlar tashlab yuboriladi,
 * shuning uchun buzilgan ma'lumot ilovani qulatmaydi.
 */
export function serializeStrokes(strokes: Stroke[]): string {
  return JSON.stringify(strokes);
}

const TOOLS = ['pen', 'marker', 'eraser', 'line', 'rect', 'ellipse'];

function isStroke(value: unknown): value is Stroke {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const s = value as Record<string, unknown>;
  return (
    typeof s.id === 'string' &&
    typeof s.tool === 'string' &&
    TOOLS.includes(s.tool) &&
    typeof s.color === 'string' &&
    typeof s.width === 'number' &&
    Array.isArray(s.points) &&
    s.points.every(
      (p) =>
        typeof p === 'object' &&
        p !== null &&
        typeof (p as Record<string, unknown>).x === 'number' &&
        typeof (p as Record<string, unknown>).y === 'number',
    )
  );
}

export function deserializeStrokes(raw: string | null): Stroke[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Eski versiyada saqlangan yozuvlarda opacity/fill bo'lmasligi mumkin — standart qiymat qo'yamiz.
    return parsed.filter(isStroke).map((s) => ({
      ...s,
      opacity: typeof s.opacity === 'number' ? s.opacity : 1,
      fill: s.fill === true,
    }));
  } catch {
    return [];
  }
}
