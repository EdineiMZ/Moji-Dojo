import { VOCAB } from '@/content';
import { checkAnswer } from '@/features/translate/check';
import { translationPool } from '@/features/translate/items';
import { buildDictation, buildListenQuestion, buildListenRound, dictationWords, phraseTarget, wordTarget } from './dictation';

describe('ditado', () => {
  it('sem palavras aprendidas, usa o vocabulário todo (sem palavras de uma letra só)', () => {
    const words = dictationWords({});
    expect(words.length).toBeGreaterThan(500);
    expect(words.every((w) => [...w.reading].length >= 2)).toBe(true);
  });

  it('com palavras aprendidas de sobra, usa só elas', () => {
    const learned = VOCAB.filter((w) => [...w.reading].length >= 2).slice(0, 12);
    const vocab = Object.fromEntries(learned.map((w) => [`${w.id}|jm`, { b: 2, due: 1 }]));
    expect(dictationWords(vocab).map((w) => w.id).sort()).toEqual(learned.map((w) => w.id).sort());
  });

  it('o alvo de palavra fala a leitura e aceita kana ou kanji', () => {
    const word = VOCAB.find((w) => w.jp === '学校');
    if (!word) throw new Error('palavra não encontrada');
    const t = wordTarget(word);
    expect(t.speak).toBe('がっこう');
    expect(checkAnswer('がっこう', t.accepted).verdict).toBe('ok');
    expect(checkAnswer('学校', t.accepted).verdict).toBe('ok');
    expect(checkAnswer('がっこお', t.accepted).verdict).not.toBe('ok');
  });

  it('o alvo de frase fala sem espaços e aceita a própria frase', () => {
    for (const item of translationPool().slice(0, 40)) {
      const t = phraseTarget(item);
      expect(t.speak).not.toContain(' ');
      expect(checkAnswer(t.answer, t.accepted).verdict).toBe('ok');
    }
  });

  it('a rodada tem o número pedido de alvos com som', () => {
    for (const kind of ['words', 'phrases'] as const) {
      const round = buildDictation(kind, {}, Math.random, 8);
      expect(round).toHaveLength(8);
      expect(round.every((t) => Boolean(t.speak))).toBe(true);
    }
  });
});

describe('compreensão', () => {
  it('a pergunta toca a frase e tem a tradução certa entre quatro, sem repetir', () => {
    const item = translationPool()[3];
    if (!item) throw new Error('sem frase');
    const q = buildListenQuestion(item, () => 0.4);
    expect(q.direction).toBe('audio');
    expect(q.item).toMatchObject({ char: item.pt, reading: item.jp.replace(/ /g, '') });
    const chars = q.options.map((o) => o.char);
    expect(chars).toContain(item.pt);
    expect(chars).toHaveLength(4);
    expect(new Set(chars).size).toBe(4);
  });

  it('uma rodada traz frases diferentes', () => {
    const round = buildListenRound(8);
    expect(round).toHaveLength(8);
    expect(new Set(round.map((q) => q.item.char)).size).toBe(8);
  });
});
