import { segment } from '@/features/bank/lexicon';
import { levelOf, READINGS } from './readings';

describe('textos para ler', () => {
  it('há textos de cada nível, e os do N4 usam a gramática do N4', () => {
    const n4 = READINGS.filter((t) => levelOf(t) === 'N4');
    expect(n4.filter((t) => t.kind === 'texto').length).toBeGreaterThanOrEqual(7);
    expect(n4.filter((t) => t.kind === 'dia').length).toBeGreaterThanOrEqual(3);
    expect(READINGS.filter((t) => levelOf(t) === 'N5').length).toBeGreaterThanOrEqual(15);
    const all = n4.flatMap((t) => t.lines.map((l) => l.jp)).join('');
    for (const pattern of ['かもしれません', 'ことにしました', 'てしまいました', 'ておきます', 'はず', 'られました', 'ば、', 'させます', 'ようになりました', 'ために', 'のに', 'と、', 'たら']) {
      expect(all).toContain(pattern);
    }
  });

  it('há textos do N3, e eles usam a gramática do N3', () => {
    const n3 = READINGS.filter((t) => levelOf(t) === 'N3');
    expect(n3.filter((t) => t.kind === 'texto').length).toBeGreaterThanOrEqual(6);
    expect(n3.filter((t) => t.kind === 'dia').length).toBeGreaterThanOrEqual(3);
    const all = n3.flatMap((t) => t.lines.map((l) => l.jp)).join('');
    for (const pattern of ['ことになりました', 'らしい', 'ところ', 'について', 'おかげ', 'まま', 'せい', 'として', '対して', 'によって', 'ほど', 'さえ', 'はずが', 'うちに', 'っぽい']) {
      expect(all).toContain(pattern);
    }
  });

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
