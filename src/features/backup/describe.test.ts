import { summarizeProgress } from './backup';
import { describeCounts, hasProgress, ignoredNote } from './describe';

describe('describeCounts', () => {
  it('usa singular e plural', () => {
    expect(describeCounts({ lessons: 1, reviews: 1, characters: 1, days: 1 })).toEqual([
      '1 lição concluída',
      '1 caractere na revisão',
      '1 caractere com histórico de acertos',
      '1 dia de estudo',
    ]);
    expect(describeCounts({ lessons: 12, reviews: 0, characters: 40, days: 3 })).toEqual([
      '12 lições concluídas',
      '0 caracteres na revisão',
      '40 caracteres com histórico de acertos',
      '3 dias de estudo',
    ]);
  });
});

describe('ignoredNote', () => {
  it('é vazio sem itens ignorados', () => {
    expect(ignoredNote(0)).toBe('');
  });

  it('concorda no singular e no plural', () => {
    expect(ignoredNote(1)).toBe('1 item do código foi ignorado por não existirem mais neste app.');
    expect(ignoredNote(4)).toContain('4 itens do código foram ignorados');
  });
});

describe('summarizeProgress / hasProgress', () => {
  it('conta cada parte do progresso', () => {
    const counts = summarizeProgress({
      srs: { あ: { b: 1, due: 0 }, い: { b: 2, due: 0 } },
      lessons: { 'hira:L0': true },
      stats: { あ: { c: 1, w: 0 } },
      days: ['2026-10-22', '2026-10-21', '2026-10-20'],
    });
    expect(counts).toEqual({ lessons: 1, reviews: 2, characters: 1, days: 3 });
    expect(hasProgress(counts)).toBe(true);
  });

  it('progresso vazio', () => {
    const counts = summarizeProgress({ srs: {}, lessons: {}, stats: {}, days: [] });
    expect(counts).toEqual({ lessons: 0, reviews: 0, characters: 0, days: 0 });
    expect(hasProgress(counts)).toBe(false);
  });
});
