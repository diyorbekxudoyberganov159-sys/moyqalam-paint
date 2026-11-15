import AsyncStorage from '@react-native-async-storage/async-storage';

import { Stroke } from '../models/drawing';
import { STORAGE_KEYS } from './storageKeys';
import { deserializeStrokes, serializeStrokes } from './strokeSerializer';

/**
 * Qoralama — hozir kanvasda turgan chizma.
 * Ilova yopilib qayta ochilganda chizma yo'qolmasligi uchun avtomatik saqlanadi.
 */
export async function loadDraft(): Promise<Stroke[]> {
  try {
    return deserializeStrokes(await AsyncStorage.getItem(STORAGE_KEYS.draft));
  } catch (error) {
    console.warn('Qoralamani o`qib bo`lmadi:', error);
    return [];
  }
}

export async function saveDraft(strokes: Stroke[]): Promise<void> {
  try {
    if (strokes.length === 0) {
      await AsyncStorage.removeItem(STORAGE_KEYS.draft);
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.draft, serializeStrokes(strokes));
    }
  } catch (error) {
    console.warn('Qoralamani saqlab bo`lmadi:', error);
  }
}
