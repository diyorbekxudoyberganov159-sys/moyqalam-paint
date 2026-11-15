import AsyncStorage from '@react-native-async-storage/async-storage';

import { createId } from '../logic/id';
import { SavedDrawing, Stroke } from '../models/drawing';
import { deletePng, persistPng } from './imageFiles';
import { STORAGE_KEYS } from './storageKeys';
import { deserializeStrokes, serializeStrokes } from './strokeSerializer';

/**
 * Saqlangan rasmlar ombori (repository).
 *  - ro'yxat (nom, sana, PNG manzili) → AsyncStorage `drawings` kaliti
 *  - har bir rasmning chiziqlari     → `strokes:<id>` kaliti (rasmni qayta tahrirlash uchun)
 *  - PNG faylning o'zi                → imageFiles.ts
 */

async function readList(): Promise<SavedDrawing[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.drawings);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (d): d is SavedDrawing =>
        typeof d === 'object' &&
        d !== null &&
        typeof d.id === 'string' &&
        typeof d.name === 'string' &&
        typeof d.imageUri === 'string',
    );
  } catch (error) {
    console.warn('Rasmlar ro`yxatini o`qib bo`lmadi:', error);
    return [];
  }
}

async function writeList(list: SavedDrawing[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.drawings, JSON.stringify(list));
}

/** Barcha rasmlar — eng yangisi birinchi. */
export async function getAllDrawings(): Promise<SavedDrawing[]> {
  const list = await readList();
  return list.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getDrawing(id: string): Promise<SavedDrawing | undefined> {
  const list = await readList();
  return list.find((d) => d.id === id);
}

export async function getDrawingStrokes(id: string): Promise<Stroke[]> {
  return deserializeStrokes(await AsyncStorage.getItem(STORAGE_KEYS.strokesPrefix + id));
}

/**
 * Yangi rasmni saqlaydi.
 * @param tempImageUri captureRef natijasi (vaqtinchalik PNG)
 */
export async function saveDrawing(
  name: string,
  tempImageUri: string,
  strokes: Stroke[],
): Promise<SavedDrawing> {
  const id = createId();
  const imageUri = await persistPng(tempImageUri, id);
  const drawing: SavedDrawing = {
    id,
    name: name.trim(),
    imageUri,
    createdAt: Date.now(),
    strokeCount: strokes.length,
  };
  await AsyncStorage.setItem(STORAGE_KEYS.strokesPrefix + id, serializeStrokes(strokes));
  const list = await readList();
  await writeList([drawing, ...list]);
  return drawing;
}

export async function renameDrawing(id: string, newName: string): Promise<void> {
  const list = await readList();
  await writeList(list.map((d) => (d.id === id ? { ...d, name: newName.trim() } : d)));
}

export async function deleteDrawing(id: string): Promise<void> {
  const list = await readList();
  const target = list.find((d) => d.id === id);
  if (target) {
    deletePng(target.imageUri);
  }
  await AsyncStorage.removeItem(STORAGE_KEYS.strokesPrefix + id);
  await writeList(list.filter((d) => d.id !== id));
}
