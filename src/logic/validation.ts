/**
 * Foydalanuvchi kiritgan ma'lumotlarni tekshirish.
 * Funksiya xato matnini qaytaradi yoki hammasi to'g'ri bo'lsa `null`.
 */

export const MAX_NAME_LENGTH = 40;

/** Fayl nomida ishlatib bo'lmaydigan belgilar. */
const FORBIDDEN_CHARS = /[\\/:*?"<>|]/;

export function validateDrawingName(rawName: string, existingNames: string[] = []): string | null {
  const name = rawName.trim();

  if (name.length === 0) {
    return 'Rasm nomini kiriting.';
  }
  if (name.length < 2) {
    return "Nom kamida 2 ta belgidan iborat bo'lishi kerak.";
  }
  if (name.length > MAX_NAME_LENGTH) {
    return `Nom ${MAX_NAME_LENGTH} ta belgidan oshmasligi kerak.`;
  }
  if (FORBIDDEN_CHARS.test(name)) {
    return 'Nomda \\ / : * ? " < > | belgilari bo\'lmasligi kerak.';
  }
  const lower = name.toLowerCase();
  if (existingNames.some((n) => n.trim().toLowerCase() === lower)) {
    return 'Bu nom bilan rasm allaqachon saqlangan.';
  }
  return null;
}

/** Qalinlik qiymatini ruxsat etilgan oraliqqa keltiradi (masalan, buzilgan sozlama o'qilganda). */
export function clampWidth(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, Math.round(value)));
}

/** Rang satri to'g'ri HEX formatdami (#RGB yoki #RRGGBB). */
export function isValidHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

/** Standart nom taklifi: "Rasm 15.11.2026 13:45". */
export function suggestDrawingName(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `Rasm ${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}
