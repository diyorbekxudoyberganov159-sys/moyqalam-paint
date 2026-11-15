import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS, MAX_OPACITY, MAX_WIDTH, MIN_OPACITY, MIN_WIDTH } from '../constants/brush';
import { clampWidth, isValidHexColor } from '../logic/validation';
import { BrushSettings, Tool } from '../models/drawing';

const TOOLS: Tool[] = ['pen', 'marker', 'eraser', 'line', 'rect', 'ellipse'];
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
      tool: parsed.tool && TOOLS.includes(parsed.tool) ? parsed.tool : DEFAULT_SETTINGS.tool,
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
      opacity:
        typeof parsed.opacity === 'number' && Number.isFinite(parsed.opacity)
          ? Math.min(MAX_OPACITY, Math.max(MIN_OPACITY, parsed.opacity))
          : DEFAULT_SETTINGS.opacity,
      fillShapes: parsed.fillShapes === true,
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
