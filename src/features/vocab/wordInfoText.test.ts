import { VOCAB, findWord } from '@/content';
import { WORD_EXTRAS } from '@/content/wordExtras';
import { SENTENCE_BANK } from '@/content/sentenceBank';
import { explainItem } from '@/features/quiz/explain';
import { shownChar } from '@/features/quiz/quiz';
import { displayOf, exampleOf, explainWord, otherSensesOf } from './wordInfoText';
import { toQuizItem } from './questions';

const word = (id: string) => findWord(id) as (typeof VOCAB)[number];

describe('sufixos e prefixos na tela', () => {
  it('〜にくい aparece com o traço e o id continua sendo a palavra', () => {
    expect(displayOf(word('にくい'))).toBe('〜にくい');
    const item = toQuizItem(word('にくい'));
    expect(item.char).toBe('にくい');
    expect(shownChar(item)).toBe('〜にくい');
  });

  it('sufixo e prefixo sem entrada própria ganham o traço pelo significado', () => {
    const suffix = VOCAB.find((w) => /\(sufixo\)$/u.test(w.meaning) && WORD_EXTRAS[w.id] === undefined) as (typeof VOCAB)[number];
    expect(displayOf(suffix)).toBe(`〜${suffix.jp}`);
    const prefix = VOCAB.find((w) => /\(prefixo\)$/u.test(w.meaning) && WORD_EXTRAS[w.id] === undefined) as (typeof VOCAB)[number];
    expect(displayOf(prefix)).toBe(`${prefix.jp}〜`);
  });

  it('palavra comum não muda', () => {
    const plain = VOCAB.find((w) => !/\((sufixo|prefixo)/u.test(w.meaning) && !WORD_EXTRAS[w.id]) as (typeof VOCAB)[number];
    expect(displayOf(plain)).toBe(plain.jp);
    expect(shownChar(toQuizItem(plain))).toBe(plain.jp);
  });
});

describe('exemplos', () => {
  it('toda palavra com extras existe no vocabulário', () => {
    for (const id of Object.keys(WORD_EXTRAS)) expect(findWord(id)).toBeDefined();
  });

  it('o exemplo tem frase, leitura e tradução, e a frase do Tatoeba confere com o banco quando está nele', () => {
    const bank = new Map(SENTENCE_BANK.map((s) => [s.id, s]));
    for (const [id, extra] of Object.entries(WORD_EXTRAS)) {
      const ex = extra.example;
      if (!ex) continue;
      expect([ex.jp, ex.reading, ex.pt].every((t) => t.length > 0)).toBe(true);
      expect(Number.isInteger(ex.tatoeba)).toBe(true);
      const inBank = bank.get(ex.tatoeba);
      if (inBank) {
        expect(ex.jp).toBe(inBank.jp);
        expect(ex.pt).toBe(inBank.pt);
      }
      // o sufixo aparece na frase (não é um exemplo de outra coisa)
      const core = displayOf(word(id)).replace('〜', '');
      expect(ex.jp.includes(core) || ex.reading.includes(core) || id === 'ぽい').toBe(true);
    }
  });

  it('〜にくい traz o exemplo com a tradução depois da resposta', () => {
    expect(exampleOf(word('にくい'))?.pt).toBe('É difícil imaginar.');
    const text = explainItem(toQuizItem(word('にくい')));
    expect(text).toContain('〜にくい = difícil de (fazer)');
    expect(text).toContain('Exemplo: イメージしにくい。');
    expect(text).toContain('É difícil imaginar.');
  });
});

describe('outros sentidos da mesma leitura', () => {
  it('にくい mostra 憎い, e 憎い mostra 〜にくい', () => {
    expect(otherSensesOf(word('にくい')).map((w) => w.jp)).toContain('憎い');
    expect(otherSensesOf(word('憎い')).map((w) => w.jp)).toContain('にくい');
    expect(explainWord(word('憎い'))).toContain('〜にくい = difícil de (fazer)');
    expect(explainWord(word('にくい'))).toContain('憎い (にくい) = odioso; detestável');
  });

  it('formas da mesma palavra (あさ / 朝) não são "outros sentidos"', () => {
    const others = otherSensesOf(word('朝'));
    expect(others.some((w) => w.meaning === word('朝').meaning)).toBe(false);
  });

  it('no máximo 4 e nunca a própria palavra', () => {
    for (const w of VOCAB.slice(0, 2000)) {
      const others = otherSensesOf(w);
      expect(others.length).toBeLessThanOrEqual(4);
      expect(others.some((o) => o.id === w.id)).toBe(false);
    }
  });
});
