import {
  clampWidth,
  isValidHexColor,
  suggestDrawingName,
  validateDrawingName,
} from '../src/logic/validation';

describe('validateDrawingName', () => {
  it('to`g`ri nom uchun null', () => {
    expect(validateDrawingName('Mening mushugim')).toBeNull();
  });
  it('bo`sh yoki faqat probel — xato', () => {
    expect(validateDrawingName('')).not.toBeNull();
    expect(validateDrawingName('    ')).not.toBeNull();
  });
  it('juda qisqa va juda uzun nom — xato', () => {
    expect(validateDrawingName('a')).not.toBeNull();
    expect(validateDrawingName('x'.repeat(41))).not.toBeNull();
  });
  it('taqiqlangan belgilar — xato', () => {
    expect(validateDrawingName('rasm/1')).not.toBeNull();
    expect(validateDrawingName('rasm?')).not.toBeNull();
  });
  it('takroriy nom (katta-kichik harf farqsiz) — xato', () => {
    expect(validateDrawingName('Gul', ['gul'])).toBe('Bu nom bilan rasm allaqachon saqlangan.');
  });
});

describe('yordamchi funksiyalar', () => {
  it('clampWidth oraliqqa keltiradi', () => {
    expect(clampWidth(100, 1, 40)).toBe(40);
    expect(clampWidth(-5, 1, 40)).toBe(1);
    expect(clampWidth(Number.NaN, 1, 40)).toBe(1);
    expect(clampWidth(7.6, 1, 40)).toBe(8);
  });
  it('isValidHexColor', () => {
    expect(isValidHexColor('#fff')).toBe(true);
    expect(isValidHexColor('#4F46E5')).toBe(true);
    expect(isValidHexColor('red')).toBe(false);
    expect(isValidHexColor('#12345')).toBe(false);
  });
  it('suggestDrawingName sanani formatlaydi', () => {
    expect(suggestDrawingName(new Date(2026, 10, 5, 9, 7))).toBe('Rasm 05.11.2026 09:07');
  });
});
