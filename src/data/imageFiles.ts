import { Directory, File, Paths } from 'expo-file-system';

/**
 * PNG fayllar bilan ishlash (Android/iOS).
 * Rasmlar ilovaning shaxsiy papkasida saqlanadi: <documents>/drawings/<id>.png
 * Bu papka internet talab qilmaydi va ilova o'chirilmaguncha saqlanib turadi.
 *
 * Web uchun alohida realizatsiya: imageFiles.web.ts (Metro avtomatik tanlaydi).
 */

function drawingsDirectory(): Directory {
  const dir = new Directory(Paths.document, 'drawings');
  if (!dir.exists) {
    dir.create({ intermediates: true });
  }
  return dir;
}

/**
 * captureRef qaytargan vaqtinchalik PNG faylni doimiy papkaga ko'chiradi.
 * @returns doimiy fayl manzili (file://...)
 */
export async function persistPng(tempUri: string, id: string): Promise<string> {
  const source = new File(tempUri);
  const target = new File(drawingsDirectory(), `${id}.png`);
  if (target.exists) {
    target.delete();
  }
  await source.copy(target);
  return target.uri;
}

export function deletePng(uri: string): void {
  try {
    const file = new File(uri);
    if (file.exists) {
      file.delete();
    }
  } catch (error) {
    console.warn('Faylni o`chirib bo`lmadi:', error);
  }
}

/** captureRef qaysi formatda natija qaytarishi kerak. */
export const CAPTURE_RESULT = 'tmpfile' as const;
