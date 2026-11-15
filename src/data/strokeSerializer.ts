import { Stroke } from '../models/drawing';

/**
 * Chiziqlarni JSON ga yozish/o'qish.
 * O'qishda har bir chiziq tekshiriladi: noto'g'ri yozuvlar tashlab yuboriladi,
 * shuning uchun buzilgan ma'lumot ilovani qulatmaydi.
 */
export function serializeStrokes(strokes: Stroke[]): string {
  return JSON.stringify(strokes);
}

function isStroke(value: unknown): value is Stroke {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const s = value as Record<string, unknown>;
  return (
    typeof s.id === 'string' &&
    (s.tool === 'pen' || s.tool === 'eraser') &&
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
    return Array.isArray(parsed) ? parsed.filter(isStroke) : [];
  } catch {
    return [];
  }
}
