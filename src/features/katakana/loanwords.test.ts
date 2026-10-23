import { kanaToRomaji } from '@/lib/romaji';
import { buildLoanQuestion, buildLoanRound, LOAN_ROUND, LOAN_WORDS, plausibleMistakes } from './loanwords';

describe('katakana de palavras estrangeiras', () => {
  it('há palavras suficientes só em katakana', () => {
    expect(LOAN_WORDS.length).toBeGreaterThan(40);
    for (const w of LOAN_WORDS) expect(w.jp).toMatch(/^[ァ-ヶー]+$/);
  });

  it('os erros plausíveis nunca repetem o certo e trocam letras parecidas', () => {
    const word = LOAN_WORDS[0]!;
    for (const m of plausibleMistakes(word)) expect(m).not.toBe(kanaToRomaji(word.reading));
    const shi = { ...word, jp: 'シャツ', id: 'シャツ', reading: 'シャツ' };
    expect(plausibleMistakes(shi)).toContain(kanaToRomaji('シャシ'));
  });

  it('toda pergunta tem 4 alternativas diferentes e a certa entre elas', () => {
    for (const mode of ['romaji', 'meaning'] as const) {
      for (const word of LOAN_WORDS) {
        const q = buildLoanQuestion(word, mode);
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options.map((o) => o.label)).size).toBe(4);
        expect(q.options.filter((o) => o.char === q.item.char)).toHaveLength(1);
      }
    }
  });

  it('a rodada traz palavras diferentes', () => {
    const round = buildLoanRound('romaji');
    expect(round).toHaveLength(LOAN_ROUND);
    expect(new Set(round.map((q) => q.item.char)).size).toBe(LOAN_ROUND);
  });
});
