import * as MediaLibrary from 'expo-media-library/legacy';
import * as Sharing from 'expo-sharing';

/**
 * Rasmni ilovadan tashqariga chiqarish (Android/iOS):
 *  - telefon galereyasiga saqlash (expo-media-library)
 *  - boshqa ilovaga ulashish (expo-sharing: Telegram, Gmail va h.k.)
 * Ikkalasi ham internet talab qilmaydi — fayl telefonda turibdi.
 */

export type ExportResult = 'ok' | 'denied' | 'unavailable';

export async function saveToGallery(uri: string, _name: string): Promise<ExportResult> {
  // writeOnly = true: faqat yozish ruxsati so'raladi (foydalanuvchi rasmlarini o'qimaymiz).
  const permission = await MediaLibrary.requestPermissionsAsync(true);
  if (!permission.granted) {
    return 'denied';
  }
  await MediaLibrary.saveToLibraryAsync(uri);
  return 'ok';
}

export async function shareImage(uri: string, name: string): Promise<ExportResult> {
  if (!(await Sharing.isAvailableAsync())) {
    return 'unavailable';
  }
  await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: name, UTI: 'public.png' });
  return 'ok';
}
