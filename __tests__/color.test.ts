import { buildSpectrum, hslToHex, normalizeHex } from '../src/logic/color';

describe('ranglar', () => {
  it('hslToHex asosiy ranglar', () => {
    expect(hslToHex(0, 100, 50)).toBe('#FF0000');
    expect(hslToHex(120, 100, 50)).toBe('#00FF00');
    expect(hslToHex(240, 100, 50)).toBe('#0000FF');
    expect(hslToHex(0, 0, 100)).toBe('#FFFFFF');
  });
  it('spektr 4×12', () => {
    const s = buildSpectrum();
    expect(s).toHaveLength(4);
    s.forEach((row) => expect(row).toHaveLength(12));
  });
  it('normalizeHex', () => {
    expect(normalizeHex('abc')).toBe('#AABBCC');
    expect(normalizeHex('#ff8800')).toBe('#FF8800');
  });
});
