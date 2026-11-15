/**
 * Web versiya: brauzerda fayl tizimi yo'q, shuning uchun PNG rasm
 * `data:image/png;base64,...` satri ko'rinishida saqlanadi (AsyncStorage → localStorage).
 * Bu fayl faqat ilovani kompyuterda ko'rsatish/sinash uchun.
 */
export async function persistPng(tempUri: string, _id: string): Promise<string> {
  return tempUri;
}

export function deletePng(_uri: string): void {
  // data-URI alohida fayl emas — o'chirish uchun hech narsa qilish shart emas.
}

export const CAPTURE_RESULT = 'data-uri' as const;
