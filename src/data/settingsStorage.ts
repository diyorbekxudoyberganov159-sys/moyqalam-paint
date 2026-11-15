import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS, MAX_WIDTH, MIN_WIDTH } from '../constants/brush';
import { clampWidth, isValidHexColor } from '../logic/validation';
import { BrushSettings } from '../models/drawing';
import { STORAGE_KEYS } from './storageKeys';

/**
 * Qalam sozlamalarini (rang, qalinlik, asbob) lokal saqlash.
 * O'qilgan ma'lumot buzilgan bo'lsa ham ilova qulamaydi — standart qiymat olinadi.
 */
export async function loadSettings(): Promise<BrushSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw) as Partial<BrushSettings>;
    return {
      tool: parsed.tool === 'eraser' ? 'eraser' : 'pen',
      color:
        typeof parsed.color === 'string' && isValidHexColor(parsed.color)
          ? parsed.color
          : DEFAULT_SETTINGS.color,
      penWidth: clampWidth(Number(parsed.penWidth ?? DEFAULT_SETTINGS.penWidth), MIN_WIDTH, MAX_WIDTH),
      eraserWidth: clampWidth(
        Number(parsed.eraserWidth ?? DEFAULT_SETTINGS.eraserWidth),
        MIN_WIDTH,
        MAX_WIDTH,
      ),
    };
  } catch (error) {
    console.warn('Sozlamalarni o`qib bo`lmadi:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: BrushSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  } catch (error) {
    console.warn('Sozlamalarni saqlab bo`lmadi:', error);
  }
}
