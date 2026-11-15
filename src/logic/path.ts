import { Point } from '../models/drawing';

/** Ikki nuqta orasidagi masofa. */
export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Koordinatani 1 xona aniqlikda yaxlitlaydi (saqlanadigan JSON hajmi kichrayadi). */
const round = (n: number): number => Math.round(n * 10) / 10;

/**
 * Nuqtalar ro'yxatini SVG `path` satriga aylantiradi.
 *
 * Chiziq silliq ko'rinishi uchun har ikki qo'shni nuqtaning o'rtasi orqali
 * kvadratik Bezier egri chizig'i (Q buyrug'i) o'tkaziladi.
 * Bitta nuqta bo'lsa — juda qisqa chiziq qaytariladi, u `round` uchlar
 * tufayli ekranda nuqta bo'lib ko'rinadi.
 */
export function pointsToPath(points: Point[]): string {
  if (points.length === 0) {
    return '';
  }

  const first = points[0];
  if (points.length === 1) {
    return `M${round(first.x)},${round(first.y)} L${round(first.x + 0.1)},${round(first.y)}`;
  }

  if (points.length === 2) {
    const second = points[1];
    return `M${round(first.x)},${round(first.y)} L${round(second.x)},${round(second.y)}`;
  }

  let d = `M${round(first.x)},${round(first.y)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    d += ` Q${round(current.x)},${round(current.y)} ${round(midX)},${round(midY)}`;
  }
  const last = points[points.length - 1];
  d += ` L${round(last.x)},${round(last.y)}`;
  return d;
}

/**
 * Yangi nuqtani qo'shish kerakmi? Barmoq juda oz siljigan bo'lsa (minDistance dan kam),
 * nuqta qo'shilmaydi — bu ortiqcha nuqtalarni kamaytiradi va ilova tez ishlaydi.
 */
export function shouldAddPoint(last: Point | undefined, next: Point, minDistance = 1.5): boolean {
  if (!last) {
    return true;
  }
  return distance(last, next) >= minDistance;
}
