import { LESSONS } from '@/data/lessons';
import {
  findLesson,
  lessonHasWriting,
  lessonPassed,
  lessonStatus,
  nextLessonIndex,
  trailProgress,
  type CompletedLessons,
} from './trail';

describe('lessonStatus', () => {
  it('só a primeira lição está aberta no começo; as outras bloqueadas', () => {
    expect(lessonStatus('hira', 0, {})).toBe('open');
    expect(lessonStatus('hira', 1, {})).toBe('lock');
    expect(lessonStatus('hira', 5, {})).toBe('lock');
  });

  it('concluir uma lição abre a seguinte', () => {
    const done: CompletedLessons = { 'hira:L0': true };
    expect(lessonStatus('hira', 0, done)).toBe('done');
    expect(lessonStatus('hira', 1, done)).toBe('open');
    expect(lessonStatus('hira', 2, done)).toBe('lock');
  });

  it('cada escrita tem a sua trilha independente', () => {
    const done: CompletedLessons = { 'hira:L0': true };
    expect(lessonStatus('kata', 0, done)).toBe('open');
    expect(lessonStatus('kanji', 0, done)).toBe('open');
  });

  it('índice inexistente é bloqueado', () => {
    expect(lessonStatus('hira', 999, {})).toBe('lock');
  });
});

describe('nextLessonIndex / trailProgress', () => {
  it('aponta a primeira lição não concluída', () => {
    expect(nextLessonIndex('hira', {})).toBe(0);
    expect(nextLessonIndex('hira', { 'hira:L0': true, 'hira:L1': true })).toBe(2);
  });

  it('devolve -1 quando a trilha acabou', () => {
    const all = Object.fromEntries(LESSONS.kanji.map((l) => [l.id, true as const]));
    expect(nextLessonIndex('kanji', all)).toBe(-1);
  });

  it('conta lições concluídas', () => {
    expect(trailProgress('hira', { 'hira:L0': true })).toEqual({ done: 1, total: LESSONS.hira.length });
  });
});

describe('lessonPassed', () => {
  it('lição normal exige 80% de acertos na primeira tentativa', () => {
    expect(lessonPassed(8, 10, false)).toBe(true);
    expect(lessonPassed(7, 10, false)).toBe(false);
  });

  it('o teste do "Já sei" exige 90%', () => {
    expect(lessonPassed(9, 10, true)).toBe(true);
    expect(lessonPassed(8, 10, true)).toBe(false);
  });

  it('sem perguntas não passa', () => {
    expect(lessonPassed(0, 0, false)).toBe(false);
  });
});

describe('lessonHasWriting / findLesson', () => {
  it('lições de kana e kanji têm traços para escrever', () => {
    expect(lessonHasWriting(LESSONS.hira[0]!)).toBe(true);
    expect(lessonHasWriting(LESSONS.kanji[0]!)).toBe(true);
  });

  it('acha a lição pelo id', () => {
    expect(findLesson('kata:L3')).toMatchObject({ script: 'kata', index: 3 });
    expect(findLesson('nada')).toBeUndefined();
  });
});
