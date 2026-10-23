import { segment } from '@/features/bank/lexicon';
import { READINGS } from './readings';

describe('textos para ler', () => {
  it('ids únicos e as duas categorias existem', () => {
    expect(new Set(READINGS.map((t) => t.id)).size).toBe(READINGS.length);
    expect(READINGS.some((t) => t.kind === 'texto')).toBe(true);
    expect(READINGS.filter((t) => t.kind === 'dia').length).toBeGreaterThanOrEqual(10);
  });

  it('frases sem `parts` usam só palavras do vocabulário do app (o léxico corta a frase inteira)', () => {
    const bad = READINGS.flatMap((t) => t.lines.filter((l) => !l.parts && !segment(l.jp.replace(/ /g, ''))).map((l) => `${t.id}: ${l.jp}`));
    expect(bad).toEqual([]);
  });

  it('os pedaços fecham com a frase e cada um com kanji traz leitura e significado', () => {
    for (const t of READINGS) {
      for (const l of t.lines) {
        if (!l.parts) continue;
        expect(l.parts.map((p) => p.jp).join('')).toBe(l.jp.replace(/ /g, ''));
        for (const p of l.parts) {
          if (/[一-鿿]/.test(p.jp)) {
            expect(p.reading).toBeTruthy();
            expect(p.reading).toMatch(/^[ぁ-んァ-ヶー]+$/);
            expect(p.pt).toBeTruthy();
          }
        }
      }
    }
  });

  it('toda frase tem tradução', () => {
    for (const t of READINGS) for (const l of t.lines) expect(l.pt.length).toBeGreaterThan(3);
  });

  it('o texto do dia a dia diz onde se vê', () => {
    for (const t of READINGS.filter((x) => x.kind === 'dia')) expect(t.where).toBeTruthy();
  });
});
