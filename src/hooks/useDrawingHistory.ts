import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { loadDraft, saveDraft } from '../data/draftStorage';
import { canRedo, canUndo, historyReducer, initialHistory } from '../logic/history';
import { Stroke } from '../models/drawing';

/** Avto-saqlashdan oldin kutish vaqti (har bir chiziqda diskka yozmaslik uchun). */
const AUTOSAVE_DELAY_MS = 400;

/**
 * Kanvas holati + undo/redo + avtomatik saqlash.
 * Ekran komponenti faqat shu hook bilan ishlaydi, AsyncStorage haqida bilmaydi.
 */
export function useDrawingHistory() {
  const [state, dispatch] = useReducer(historyReducer, initialHistory);
  const [isLoaded, setIsLoaded] = useState(false);
  const latestStrokes = useRef<Stroke[]>([]);
  latestStrokes.current = state.present;

  // 1) Ilova ochilganda oxirgi qoralamani yuklash.
  useEffect(() => {
    let cancelled = false;
    loadDraft().then((strokes) => {
      if (!cancelled) {
        dispatch({ type: 'LOAD', strokes });
        setIsLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Har o'zgarishdan keyin (biroz kutib) qoralamani saqlash.
  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    const timer = setTimeout(() => saveDraft(state.present), AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state.present, isLoaded]);

  // 3) Ilova fonga o'tayotganda darhol saqlash (telefon ilovani yopib qo'ysa ham yo'qolmaydi).
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (next) => {
      if (next !== 'active' && isLoaded) {
        saveDraft(latestStrokes.current);
      }
    });
    return () => subscription.remove();
  }, [isLoaded]);

  const addStroke = useCallback((stroke: Stroke) => dispatch({ type: 'ADD_STROKE', stroke }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const replace = useCallback((strokes: Stroke[]) => dispatch({ type: 'REPLACE', strokes }), []);

  return {
    strokes: state.present,
    isLoaded,
    canUndo: canUndo(state),
    canRedo: canRedo(state),
    addStroke,
    undo,
    redo,
    clear,
    replace,
  };
}
