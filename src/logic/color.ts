/** HSL rangni HEX ko'rinishiga o'tkazadi. h: 0–360, s va l: 0–100. */
export function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

/** Spektr to'ri: 12 ta ton × 4 ta yorqinlik (rang tanlash oynasi uchun). */
export function buildSpectrum(): string[][] {
  const lightness = [78, 62, 48, 34];
  return lightness.map((l) => Array.from({ length: 12 }, (_, i) => hslToHex(i * 30, 85, l)));
}

/** "#abc" → "#AABBCC" (solishtirish oson bo'lishi uchun). */
export function normalizeHex(value: string): string {
  const v = value.trim().replace(/^#?/, '#').toUpperCase();
  if (/^#[0-9A-F]{3}$/.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  return v;
}
