import { LESSONS } from '@/content/lessons';
import { formatReviewTime } from '@/features/review/format';
import { DAY_MS } from '@/features/review/srs';
import { emptyProgress, type ProgressSnapshot } from '@/features/progress/types';
import { nextLessonOverall } from '@/features/lessons/trail';
import { buildTodaySummary, REVIEW_BATCH, scriptProgress } from './summary';

// Data fixa: quinta, 22/10/2026 às 10:00 (fuso local).
const NOW = new Date(2026, 9, 22, 10, 0, 0).getTime();
const at = (d: number, h: number, m = 0) => new Date(2026, 9, d, h, m).getTime();

describe('buildTodaySummary', () => {
  it('app novo: nada pendente e a primeira lição é a próxima', () => {
    const s = buildTodaySummary(emptyProgress(), NOW);
    expect(s).toMatchObject({ dueCount: 0, learnedCount: 0, streak: 0, upcoming: null });
    expect(s.nextLesson).toMatchObject({ script: 'hira', index: 0 });
  });

  it('conta revisões vencidas, aprendidos, dias seguidos e a próxima revisão', () => {
    const progress: ProgressSnapshot = {
      srs: {
        あ: { b: 2, due: NOW - DAY_MS },
        い: { b: 1, due: NOW },
        う: { b: 3, due: at(23, 9) },
        え: { b: 3, due: at(23, 20) },
        お: { b: 4, due: at(27, 9) },
      },
      lessons: { 'hira:L0': true },
      stats: {},
      days: ['2026-10-21', '2026-10-22'],
    };
    const s = buildTodaySummary(progress, NOW);
    expect(s.dueCount).toBe(2);
    expect(s.reviewChars).toEqual(['あ', 'い']); // do mais atrasado ao menos
    expect(s.learnedCount).toBe(5);
    expect(s.streak).toBe(2);
    expect(s.nextLesson).toMatchObject({ script: 'hira', index: 1 });
    expect(s.upcoming).toEqual({ at: at(23, 9), count: 2 });
  });

  it('limita a revisão do dia a 30 caracteres, mas informa o total', () => {
    const chars = [...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよ'];
    const srs = Object.fromEntries(chars.map((c) => [c, { b: 1, due: NOW - 1 }]));
    const s = buildTodaySummary({ ...emptyProgress(), srs }, NOW);
    expect(s.dueCount).toBe(chars.length);
    expect(s.reviewChars).toHaveLength(REVIEW_BATCH);
  });

  it('ignora caracteres desconhecidos que sobraram num backup antigo', () => {
    const s = buildTodaySummary({ ...emptyProgress(), srs: { Z: { b: 1, due: 0 } } }, NOW);
    expect(s).toMatchObject({ dueCount: 0, learnedCount: 0 });
  });
});

describe('nextLessonOverall', () => {
  const done = (script: 'hira' | 'kata' | 'kanji') =>
    Object.fromEntries(LESSONS[script].map((l) => [l.id, true as const]));

  it('passa para o katakana quando o hiragana acaba, e depois para o kanji', () => {
    expect(nextLessonOverall(done('hira'))).toMatchObject({ script: 'kata', index: 0 });
    expect(nextLessonOverall({ ...done('hira'), ...done('kata') })).toMatchObject({ script: 'kanji', index: 0 });
  });

  it('é null quando tudo foi concluído', () => {
    expect(nextLessonOverall({ ...done('hira'), ...done('kata'), ...done('kanji') })).toBeNull();
  });
});

describe('scriptProgress', () => {
  it('conta aprendidos e firmes (caixa 3+) por escrita', () => {
    const p = scriptProgress({
      あ: { b: 1, due: 0 },
      い: { b: 3, due: 0 },
      ア: { b: 6, due: 0 },
      水: { b: 2, due: 0 },
    });
    expect(p.hira).toMatchObject({ total: 104, learned: 2, firm: 1 });
    expect(p.kata).toMatchObject({ total: 123, learned: 1, firm: 1 });
    expect(p.kanji).toMatchObject({ total: 284, learned: 1, firm: 0 });
  });
});

describe('formatReviewTime', () => {
  it('hoje, amanhã e dias à frente', () => {
    expect(formatReviewTime(at(22, 18, 30), NOW)).toBe('hoje às 18:30');
    expect(formatReviewTime(at(23, 9, 5), NOW)).toBe('amanhã às 09:05');
    expect(formatReviewTime(at(25, 9), NOW)).toBe('em 3 dias (dom. 25/10)');
  });

  it('amanhã é por dia de calendário, mesmo que falte menos de 24h', () => {
    expect(formatReviewTime(at(23, 0, 10), at(22, 23, 50))).toBe('amanhã às 00:10');
  });
});
