import { HISTORY_LIMIT } from '../constants/brush';
import { Stroke } from '../models/drawing';

/**
 * Undo/Redo tarixi.
 *
 * G'oya: kanvas holati — bu chiziqlar ro'yxati (Stroke[]).
 *  - past    — oldingi holatlar (undo uchun)
 *  - present — hozirgi holat (ekranda ko'rinadi)
 *  - future  — bekor qilingan holatlar (redo uchun)
 *
 * Har bir yangi amal (chiziq qo'shish yoki tozalash) hozirgi holatni
 * `past` ga qo'yadi va `future` ni tozalaydi. Massivlar o'zgartirilmaydi
 * (immutable), shuning uchun holatlar xotirada ulashiladi va ko'p joy olmaydi.
 */
export interface HistoryState {
  past: Stroke[][];
  present: Stroke[];
  future: Stroke[][];
}

export type HistoryAction =
  | { type: 'ADD_STROKE'; stroke: Stroke }
  | { type: 'CLEAR' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD'; strokes: Stroke[] }
  | { type: 'REPLACE'; strokes: Stroke[] };

export const initialHistory: HistoryState = {
  past: [],
  present: [],
  future: [],
};

/** Yangi holatni tarixga yozadi (limitdan oshsa eng eskisini tashlaydi). */
function commit(state: HistoryState, next: Stroke[]): HistoryState {
  const past = [...state.past, state.present];
  if (past.length > HISTORY_LIMIT) {
    past.shift();
  }
  return { past, present: next, future: [] };
}

export function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'ADD_STROKE': {
      if (action.stroke.points.length === 0) {
        return state;
      }
      return commit(state, [...state.present, action.stroke]);
    }

    case 'CLEAR': {
      // Bo'sh kanvasni tozalash tarixga yozilmaydi (aks holda "bo'sh" undo qadamlari paydo bo'ladi).
      if (state.present.length === 0) {
        return state;
      }
      return commit(state, []);
    }

    case 'UNDO': {
      if (state.past.length === 0) {
        return state;
      }
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }

    case 'REDO': {
      if (state.future.length === 0) {
        return state;
      }
      const [next, ...rest] = state.future;
      return {
        past: [...state.past, state.present],
        present: next,
        future: rest,
      };
    }

    case 'LOAD': {
      // Ilova ishga tushganda qoralama yuklanadi — tarix noldan boshlanadi.
      return { past: [], present: action.strokes, future: [] };
    }

    case 'REPLACE': {
      // Galereyadagi rasm tahrirlash uchun ochilganda — bu ham amal, uni undo qilish mumkin.
      return commit(state, action.strokes);
    }

    default:
      return state;
  }
}

export const canUndo = (state: HistoryState): boolean => state.past.length > 0;
export const canRedo = (state: HistoryState): boolean => state.future.length > 0;
