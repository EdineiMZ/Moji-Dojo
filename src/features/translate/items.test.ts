import { checkAnswer } from './check';
import { buildPool, buildUnderstandQuestion, buildUnderstandRound, pickItems, translationPool } from './items';

describe('banco de frases para traduzir', () => {
  const pool = translationPool();

  it('junta exemplos, Montar e Viagem sem repetir a frase', () => {
    expect(pool.length).toBeGreaterThan(120);
    expect(new Set(pool.map((i) => i.id)).size).toBe(pool.length);
    expect(buildPool().length).toBe(pool.length);
  });

  it('toda frase tem tradução, leitura e a própria escrita entre as respostas aceitas', () => {
    for (const item of pool) {
      expect(item.pt.length).toBeGreaterThan(1);
      expect(item.romaji.length).toBeGreaterThan(1);
      expect(item.accepted).toContain(item.jp);
      expect(checkAnswer(item.jp, item.accepted).verdict).toBe('ok');
      if (item.kanji) expect(checkAnswer(item.kanji, item.accepted).verdict).toBe('ok');
    }
  });

  it('a escrita com kanji vale como resposta (ええ, 私は猫ではありません)', () => {
    const cat = pool.find((i) => i.pt === 'Eu não sou um gato.');
    expect(cat).toBeDefined();
    expect(cat?.kanji).toBe('私は猫ではありません。');
    expect(checkAnswer('私は猫ではありません', cat?.accepted ?? []).verdict).toBe('ok');
    expect(checkAnswer('わたしはねこではありません', cat?.accepted ?? []).verdict).toBe('ok');
  });

  it('aceita as outras ordens do Montar (ontem eu bebi cerveja)', () => {
    const beer = pool.find((i) => i.jp.replace(/ /g, '') === 'きのうビールをのみました');
    expect(beer).toBeDefined();
    expect(checkAnswer('ビールを きのう のみました', beer?.accepted ?? []).verdict).toBe('ok');
    expect(checkAnswer('きのう ビールを のみました', beer?.accepted ?? []).verdict).toBe('ok');
  });

  it('frases diferentes com a mesma tradução aceitam as respostas umas das outras', () => {
    const byPt = new Map<string, number>();
    for (const item of pool) byPt.set(item.pt.toLowerCase(), (byPt.get(item.pt.toLowerCase()) ?? 0) + 1);
    const repeated = pool.filter((i) => (byPt.get(i.pt.toLowerCase()) ?? 0) > 1);
    for (const a of repeated) {
      for (const b of repeated.filter((x) => x.pt.toLowerCase() === a.pt.toLowerCase())) {
        expect(a.accepted).toContain(b.jp);
      }
    }
  });
});

describe('perguntas de entender', () => {
  it('quatro traduções diferentes, uma só certa', () => {
    for (let i = 0; i < 100; i++) {
      for (const q of buildUnderstandRound(8)) {
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options.map((o) => o.label.toLowerCase())).size).toBe(4);
        expect(q.options.filter((o) => o.char === q.item.char)).toHaveLength(1);
      }
    }
  });

  it('a rodada tem frases diferentes', () => {
    const items = pickItems(8);
    expect(new Set(items.map((i) => i.id)).size).toBe(8);
    const q = buildUnderstandQuestion(items[0]!);
    expect(q.item.script === 'pair' ? q.item.explain : '').toContain(' = ');
  });
});
