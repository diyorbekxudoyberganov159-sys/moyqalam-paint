import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_SETTINGS } from '../constants/brush';
import { loadSettings, saveSettings } from '../data/settingsStorage';
import { BrushSettings, Tool } from '../models/drawing';

/** Qalam sozlamalari: tanlangan asbob, rang va qalinlik (lokal saqlanadi). */
export function useBrushSettings() {
  const [settings, setSettings] = useState<BrushSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then((loaded) => {
      setSettings(loaded);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveSettings(settings);
    }
  }, [settings, isLoaded]);

  const setTool = useCallback((tool: Tool) => setSettings((s) => ({ ...s, tool })), []);

  // Rang tanlansa avtomatik qalamga o'tamiz — foydalanuvchi uchun tabiiy.
  const setColor = useCallback(
    (color: string) => setSettings((s) => ({ ...s, color, tool: 'pen' })),
    [],
  );

  /** Qalinlik hozirgi asbobga qo'llanadi (qalam va o'chirg'ichniki alohida). */
  const setWidth = useCallback(
    (width: number) =>
      setSettings((s) => (s.tool === 'pen' ? { ...s, penWidth: width } : { ...s, eraserWidth: width })),
    [],
  );

  const activeWidth = settings.tool === 'pen' ? settings.penWidth : settings.eraserWidth;

  return { settings, activeWidth, setTool, setColor, setWidth };
}
