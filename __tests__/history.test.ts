import { HISTORY_LIMIT } from '../src/constants/brush';
import { canRedo, canUndo, historyReducer, initialHistory, HistoryState } from '../src/logic/history';
import { Stroke } from '../src/models/drawing';

const makeStroke = (id: string): Stroke => ({
  id,
  tool: 'pen',
  color: '#000000',
  width: 4,
  points: [
    { x: 0, y: 0 },
    { x: 10, y: 10 },
  ],
});

const ids = (state: HistoryState) => state.present.map((s) => s.id);

describe('undo/redo tarixi', () => {
  it('chiziq qo`shadi va undo bilan qaytaradi', () => {
    let s = historyReducer(initialHistory, { type: 'ADD_STROKE', stroke: makeStroke('a') });
    s = historyReducer(s, { type: 'ADD_STROKE', stroke: makeStroke('b') });
    expect(ids(s)).toEqual(['a', 'b']);

    s = historyReducer(s, { type: 'UNDO' });
    expect(ids(s)).toEqual(['a']);
    expect(canRedo(s)).toBe(true);

    s = historyReducer(s, { type: 'REDO' });
    expect(ids(s)).toEqual(['a', 'b']);
    expect(canRedo(s)).toBe(false);
  });

  it('yangi chiziq redo tarixini tozalaydi', () => {
    let s = historyReducer(initialHistory, { type: 'ADD_STROKE', stroke: makeStroke('a') });
    s = historyReducer(s, { type: 'ADD_STROKE', stroke: makeStroke('b') });
    s = historyReducer(s, { type: 'UNDO' });
    s = historyReducer(s, { type: 'ADD_STROKE', stroke: makeStroke('c') });
    expect(ids(s)).toEqual(['a', 'c']);
    expect(canRedo(s)).toBe(false);
  });

  it('tozalash (clear) ham undo qilinadi', () => {
    let s = historyReducer(initialHistory, { type: 'ADD_STROKE', stroke: makeStroke('a') });
    s = historyReducer(s, { type: 'CLEAR' });
    expect(s.present).toHaveLength(0);
    s = historyReducer(s, { type: 'UNDO' });
    expect(ids(s)).toEqual(['a']);
  });

  it('bo`sh kanvasni tozalash tarixga yozilmaydi', () => {
    const s = historyReducer(initialHistory, { type: 'CLEAR' });
    expect(s).toBe(initialHistory);
    expect(canUndo(s)).toBe(false);
  });

  it('tarix bo`sh bo`lsa undo/redo hech narsa qilmaydi', () => {
    expect(historyReducer(initialHistory, { type: 'UNDO' })).toBe(initialHistory);
    expect(historyReducer(initialHistory, { type: 'REDO' })).toBe(initialHistory);
  });

  it('nuqtasiz chiziq qo`shilmaydi', () => {
    const empty = { ...makeStroke('x'), points: [] };
    expect(historyReducer(initialHistory, { type: 'ADD_STROKE', stroke: empty })).toBe(initialHistory);
  });

  it('LOAD tarixni noldan boshlaydi', () => {
    let s = historyReducer(initialHistory, { type: 'ADD_STROKE', stroke: makeStroke('a') });
    s = historyReducer(s, { type: 'LOAD', strokes: [makeStroke('z')] });
    expect(ids(s)).toEqual(['z']);
    expect(canUndo(s)).toBe(false);
    expect(canRedo(s)).toBe(false);
  });

  it('REPLACE kanvasni almashtiradi va uni undo qilish mumkin', () => {
    let s = historyReducer(initialHistory, { type: 'ADD_STROKE', stroke: makeStroke('a') });
    s = historyReducer(s, { type: 'REPLACE', strokes: [makeStroke('q'), makeStroke('w')] });
    expect(ids(s)).toEqual(['q', 'w']);
    s = historyReducer(s, { type: 'UNDO' });
    expect(ids(s)).toEqual(['a']);
  });

  it(`tarix ${HISTORY_LIMIT} qadamdan oshmaydi`, () => {
    let s = initialHistory;
    for (let i = 0; i < HISTORY_LIMIT + 20; i++) {
      s = historyReducer(s, { type: 'ADD_STROKE', stroke: makeStroke(String(i)) });
    }
    expect(s.past.length).toBe(HISTORY_LIMIT);
  });
});
