import { ALL_GRAMMAR } from './grammar';
import { GENERAL_PITFALLS, TOPIC_PITFALLS } from './pitfalls';

describe('erros comuns', () => {
  it('as dicas gerais têm título e texto', () => {
    expect(GENERAL_PITFALLS.length).toBeGreaterThanOrEqual(8);
    for (const p of GENERAL_PITFALLS) {
      expect(p.title.length).toBeGreaterThan(5);
      expect(p.text.length).toBeGreaterThan(40);
    }
    expect(new Set(GENERAL_PITFALLS.map((p) => p.title)).size).toBe(GENERAL_PITFALLS.length);
  });

  it('só há notas para tópicos que existem, e quase todo tópico tem', () => {
    const ids = new Set(ALL_GRAMMAR.map((t) => t.id));
    for (const [id, lines] of Object.entries(TOPIC_PITFALLS)) {
      expect(ids.has(id)).toBe(true);
      expect(lines.length).toBeGreaterThan(0);
      for (const line of lines) expect(line.length).toBeGreaterThan(20);
    }
    expect(Object.keys(TOPIC_PITFALLS).length).toBeGreaterThanOrEqual(ALL_GRAMMAR.length - 2);
  });
});
