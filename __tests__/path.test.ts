import { distance, pointsToPath, shouldAddPoint } from '../src/logic/path';

describe('pointsToPath', () => {
  it('bo`sh ro`yxat uchun bo`sh satr', () => {
    expect(pointsToPath([])).toBe('');
  });

  it('bitta nuqta — nuqta ko`rinishidagi qisqa chiziq', () => {
    expect(pointsToPath([{ x: 5, y: 5 }])).toBe('M5,5 L5.1,5');
  });

  it('ikki nuqta — to`g`ri chiziq', () => {
    expect(pointsToPath([{ x: 0, y: 0 }, { x: 10, y: 20 }])).toBe('M0,0 L10,20');
  });

  it('ko`p nuqtada Bezier (Q) egri chiziqlar ishlatiladi', () => {
    const d = pointsToPath([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 20, y: 10 },
    ]);
    expect(d).toBe('M0,0 Q10,0 15,5 L20,10');
  });
});

describe('shouldAddPoint', () => {
  it('birinchi nuqta doim qo`shiladi', () => {
    expect(shouldAddPoint(undefined, { x: 1, y: 1 })).toBe(true);
  });
  it('juda yaqin nuqta qo`shilmaydi', () => {
    expect(shouldAddPoint({ x: 0, y: 0 }, { x: 0.5, y: 0.5 })).toBe(false);
  });
  it('uzoqroq nuqta qo`shiladi', () => {
    expect(shouldAddPoint({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(true);
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});
