import { ALL_KANJI } from '@/content/kanji';
import { KANJI_HINTS } from '@/data/hints';
import { getItem } from '@/features/catalog';
import { autoAdvanceMs, buildFeedback, explainItem, readAdvanceMs } from './explain';

describe('explainItem', () => {
  it('kana: romaji e a palavra de exemplo', () => {
    expect(explainItem(getItem('か'))).toBe('か = ka · かさ guarda-chuva');
  });

  it('kana sem exemplo mostra só o romaji', () => {
    expect(explainItem(getItem('を'))).toBe('を = wo');
  });

  it('kanji: significado e leituras on/kun', () => {
    expect(explainItem(getItem('水'))).toBe('水 = água · on スイ · kun みず');
    expect(explainItem(getItem('百'))).toBe('百 = cem · on ヒャク · kun —');
  });
});

describe('buildFeedback', () => {
  it('acerto: "Certo!" e sem dica', () => {
    expect(buildFeedback(getItem('か'), true)).toEqual({ correct: true, text: 'Certo! か = ka · かさ guarda-chuva' });
  });

  it('erro: "Era" e a dica de memorização', () => {
    const fb = buildFeedback(getItem('あ'), false);
    expect(fb.correct).toBe(false);
    expect(fb.text.startsWith('Era あ = a')).toBe(true);
    expect(fb.hint).toContain('gravata');
  });

  it('erro de um caractere sem dica não inventa texto', () => {
    // Os kana (com e sem ten-ten) já têm dica; o que pode faltar é a de algum kanji.
    const noHint = ALL_KANJI.find((k) => !KANJI_HINTS[k.char]);
    expect(noHint).toBeDefined();
    expect(buildFeedback(getItem(noHint?.char ?? ''), false)).not.toHaveProperty('hint');
  });

  it('erro num kana com ten-ten mostra a dica do kana base', () => {
    expect(buildFeedback(getItem('が'), false).hint).toContain('か (ka)');
  });
});

describe('autoAdvanceMs', () => {
  it('kanji espera mais que kana', () => {
    expect(autoAdvanceMs(getItem('水'))).toBeGreaterThan(autoAdvanceMs(getItem('か')));
  });
});

describe('readAdvanceMs', () => {
  const fb = (text: string, hint?: string) => ({ correct: false, text, ...(hint ? { hint } : {}) });
  it('dá no mínimo 3 s e no máximo 9 s para ler, e mais tempo para textos maiores', () => {
    expect(readAdvanceMs(fb('あ = a'))).toBeGreaterThanOrEqual(3000);
    expect(readAdvanceMs(fb('x'.repeat(2000)))).toBe(9000);
    expect(readAdvanceMs(fb('x'.repeat(40), 'y'.repeat(40)))).toBeGreaterThan(readAdvanceMs(fb('x'.repeat(40))));
  });
  it('soma o tempo extra (ex.: olhar o desenho ao lado do certo)', () => {
    expect(readAdvanceMs(fb('a'), 2200)).toBe(readAdvanceMs(fb('a')) + 2200);
  });
});
