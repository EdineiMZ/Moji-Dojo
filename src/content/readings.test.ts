import { segment } from '@/features/bank/lexicon';
import { READINGS } from './readings';

describe('textos para ler', () => {
  it('ids únicos e as duas categorias existem', () => {
    expect(new Set(READINGS.map((t) => t.id)).size).toBe(READINGS.length);
    expect(READINGS.some((t) => t.kind === 'texto')).toBe(true);
    expect(READINGS.some((t) => t.kind === 'dia')).toBe(true);
  });

  it('toda frase usa só palavras do vocabulário do app (o léxico consegue cortá-la inteira)', () => {
    const bad = READINGS.flatMap((t) => t.lines.filter((l) => !segment(l.jp.replace(/ /g, ''))).map((l) => `${t.id}: ${l.jp}`));
    expect(bad).toEqual([]);
  });

  it('toda frase tem tradução', () => {
    for (const t of READINGS) for (const l of t.lines) expect(l.pt.length).toBeGreaterThan(3);
  });
});
