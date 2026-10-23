import { VOCAB } from '@/content';
import { WORD_FREQUENCY } from '@/content/frequency';
import { situationWordIds, SITUATIONS, sortWords, usageOf } from './order';

describe('situações de viagem', () => {
  it('todas as palavras listadas existem no vocabulário e não se repetem na mesma situação', () => {
    const ids = new Set(VOCAB.map((w) => w.id));
    for (const s of SITUATIONS) {
      const missing = s.words.filter((id) => !ids.has(id));
      expect({ situation: s.id, missing }).toEqual({ situation: s.id, missing: [] });
      expect(new Set(s.words).size).toBe(s.words.length);
      expect(situationWordIds(s.id).size).toBe(s.words.length);
      expect(s.words.length).toBeGreaterThanOrEqual(30);
    }
  });

  it('as palavras certas estão nas situações certas', () => {
    expect(situationWordIds('restaurante').has('水')).toBe(true);
    expect(situationWordIds('transporte').has('駅')).toBe(true);
    expect(situationWordIds('compras').has('財布')).toBe(true);
    expect(situationWordIds('hotel').has('鍵')).toBe(true);
    expect(situationWordIds('ajuda').has('病院')).toBe(true);
  });

  it('situação desconhecida não tem palavras', () => {
    expect(situationWordIds('inexistente').size).toBe(0);
  });
});

describe('ordem por uso', () => {
  it('a frequência vem de uma amostra grande e ordena do mais ao menos usado', () => {
    expect(Object.keys(WORD_FREQUENCY).length).toBeGreaterThan(500);
    const words = [VOCAB.find((w) => w.id === '私')!, VOCAB.find((w) => w.id === '犬')!, VOCAB.find((w) => w.id === '来る')!];
    const sorted = sortWords(words, 'useful');
    expect(usageOf(sorted[0]!)).toBeGreaterThanOrEqual(usageOf(sorted[1]!));
    expect(usageOf(sorted[1]!)).toBeGreaterThanOrEqual(usageOf(sorted[2]!));
  });

  it('"do livro" mantém a ordem, e empates mantêm a ordem original', () => {
    const words = VOCAB.slice(0, 20);
    expect(sortWords(words, 'book').map((w) => w.id)).toEqual(words.map((w) => w.id));
    const unknown = [{ id: 'xx1' }, { id: 'xx2' }, { id: 'xx3' }];
    expect(sortWords(unknown, 'useful').map((w) => w.id)).toEqual(['xx1', 'xx2', 'xx3']);
  });

  it('as palavras mais comuns do dia a dia vêm antes das raras', () => {
    const all = sortWords(VOCAB, 'useful');
    const rankOf = (id: string) => all.findIndex((w) => w.id === id);
    expect(rankOf('する')).toBeLessThan(rankOf('歯'));
    expect(rankOf('私')).toBeLessThan(rankOf('机'));
  });
});
