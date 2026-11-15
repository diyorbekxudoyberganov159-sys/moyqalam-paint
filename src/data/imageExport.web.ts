/**
 * Web versiya: "galereya" o'rniga PNG fayl kompyuterga yuklab olinadi,
 * ulashish esa brauzer Web Share API'si orqali (bo'lmasa — yuklab olish).
 */
export type ExportResult = 'ok' | 'denied' | 'unavailable';

const safeFileName = (name: string) => `${name.replace(/[^\p{L}\p{N}\- _]/gu, '').trim() || 'rasm'}.png`;

function download(uri: string, name: string) {
  const link = document.createElement('a');
  link.href = uri;
  link.download = safeFileName(name);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function saveToGallery(uri: string, name: string): Promise<ExportResult> {
  download(uri, name);
  return 'ok';
}

export async function shareImage(uri: string, name: string): Promise<ExportResult> {
  try {
    const blob = await (await fetch(uri)).blob();
    const file = new File([blob], safeFileName(name), { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: name });
      return 'ok';
    }
  } catch {
    // Brauzer ulashishni qo'llamasa — yuklab olishga o'tamiz.
  }
  download(uri, name);
  return 'ok';
}
