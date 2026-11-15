import { MARKER_OPACITY_FACTOR, MIN_SHAPE_SIZE } from '../constants/brush';
import { Point, Stroke } from '../models/drawing';
import { distance } from './path';

/** Ikki nuqtadan to'rtburchak chegaralari (qaysi yo'nalishda tortilganidan qat'i nazar). */
export function rectFromPoints(a: Point, b: Point) {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(b.x - a.x),
    height: Math.abs(b.y - a.y),
  };
}

/** Ikki nuqtaga chizilgan to'rtburchak ichidagi ellips (markaz va radiuslar). */
export function ellipseFromPoints(a: Point, b: Point) {
  const r = rectFromPoints(a, b);
  return {
    cx: r.x + r.width / 2,
    cy: r.y + r.height / 2,
    rx: r.width / 2,
    ry: r.height / 2,
  };
}

/** Shakl juda kichik emasmi (tasodifiy teginish emasmi)? */
export function isShapeBigEnough(a: Point, b: Point): boolean {
  return distance(a, b) >= MIN_SHAPE_SIZE;
}

/** Obyektning ekrandagi haqiqiy shaffofligi (marker doim yarim shaffof). */
export function effectiveOpacity(stroke: Pick<Stroke, 'tool' | 'opacity'>): number {
  if (stroke.tool === 'eraser') {
    return 1;
  }
  const base = Math.min(1, Math.max(0.1, stroke.opacity));
  return stroke.tool === 'marker' ? base * MARKER_OPACITY_FACTOR : base;
}
