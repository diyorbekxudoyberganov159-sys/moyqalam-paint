import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_SETTINGS } from '../constants/brush';
import { loadSettings, saveSettings } from '../data/settingsStorage';
import { BrushSettings, Tool } from '../models/drawing';

/** Asbob sozlamalari: tanlangan asbob, rang, qalinlik, shaffoflik (lokal saqlanadi). */
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

  // O'chirg'ich tanlangan paytda rang bosilsa — qalamga qaytamiz (tabiiy xatti-harakat).
  const setColor = useCallback(
    (color: string) => setSettings((s) => ({ ...s, color, tool: s.tool === 'eraser' ? 'pen' : s.tool })),
    [],
  );

  /** Qalinlik hozirgi asbobga qo'llanadi (o'chirg'ichniki alohida saqlanadi). */
  const setWidth = useCallback(
    (width: number) =>
      setSettings((s) => (s.tool === 'eraser' ? { ...s, eraserWidth: width } : { ...s, penWidth: width })),
    [],
  );

  const setOpacity = useCallback((opacity: number) => setSettings((s) => ({ ...s, opacity })), []);

  const toggleFill = useCallback(() => setSettings((s) => ({ ...s, fillShapes: !s.fillShapes })), []);

  const activeWidth = settings.tool === 'eraser' ? settings.eraserWidth : settings.penWidth;

  return { settings, activeWidth, setTool, setColor, setWidth, setOpacity, toggleFill };
}
