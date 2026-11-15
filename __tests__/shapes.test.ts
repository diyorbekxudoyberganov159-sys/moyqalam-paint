import { effectiveOpacity, ellipseFromPoints, isShapeBigEnough, rectFromPoints } from '../src/logic/shapes';

describe('shakllar', () => {
  it('to`rtburchak istalgan yo`nalishda to`g`ri hisoblanadi', () => {
    expect(rectFromPoints({ x: 50, y: 40 }, { x: 10, y: 0 })).toEqual({ x: 10, y: 0, width: 40, height: 40 });
  });
  it('ellips markazi va radiuslari', () => {
    expect(ellipseFromPoints({ x: 0, y: 0 }, { x: 100, y: 50 })).toEqual({ cx: 50, cy: 25, rx: 50, ry: 25 });
  });
  it('juda kichik shakl qabul qilinmaydi', () => {
    expect(isShapeBigEnough({ x: 0, y: 0 }, { x: 1, y: 1 })).toBe(false);
    expect(isShapeBigEnough({ x: 0, y: 0 }, { x: 10, y: 0 })).toBe(true);
  });
  it('marker yarim shaffof, o`chirg`ich doim to`liq', () => {
    expect(effectiveOpacity({ tool: 'pen', opacity: 1 })).toBe(1);
    expect(effectiveOpacity({ tool: 'marker', opacity: 1 })).toBeCloseTo(0.45);
    expect(effectiveOpacity({ tool: 'eraser', opacity: 0.2 })).toBe(1);
    expect(effectiveOpacity({ tool: 'pen', opacity: 5 })).toBe(1);
  });
});
