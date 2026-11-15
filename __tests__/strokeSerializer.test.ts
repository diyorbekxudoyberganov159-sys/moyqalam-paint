import { deserializeStrokes, serializeStrokes } from '../src/data/strokeSerializer';
import { Stroke } from '../src/models/drawing';

const stroke: Stroke = {
  id: '1',
  tool: 'pen',
  color: '#DC2626',
  width: 6,
  opacity: 1,
  fill: false,
  points: [{ x: 1, y: 2 }],
};

describe('strokeSerializer', () => {
  it('yozib o`qilganda bir xil natija', () => {
    expect(deserializeStrokes(serializeStrokes([stroke]))).toEqual([stroke]);
  });
  it('null yoki buzilgan JSON — bo`sh ro`yxat (ilova qulamaydi)', () => {
    expect(deserializeStrokes(null)).toEqual([]);
    expect(deserializeStrokes('{buzilgan')).toEqual([]);
    expect(deserializeStrokes('"satr"')).toEqual([]);
  });
  it('eski formatdagi yozuvga opacity va fill qo`shiladi', () => {
    const { opacity, fill, ...old } = stroke;
    expect(deserializeStrokes(JSON.stringify([old]))).toEqual([stroke]);
  });
  it('noto`g`ri yozuvlar tashlab yuboriladi', () => {
    const raw = JSON.stringify([stroke, { id: 2 }, { ...stroke, tool: 'brush' }]);
    expect(deserializeStrokes(raw)).toEqual([stroke]);
  });
});
