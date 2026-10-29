import { KANA } from '@/data/kana';
import { KANA_MNEMONICS } from '@/data/hints';
import { chartChars, chartRows } from './chart';
import { LOOKALIKES } from './lookalikes';

describe('tabela de kana', () => {
  it('o hiragana básico tem 11 linhas e 46 letras, com os vazios no lugar', () => {
    const rows = chartRows('hira', 'base');
    expect(rows).toHaveLength(11);
    expect(rows.flat().filter(Boolean)).toHaveLength(46);
    expect(rows[0]?.map((c) => c?.char)).toEqual(['あ', 'い', 'う', 'え', 'お']);
    expect(rows[7]?.map((c) => c?.char ?? null)).toEqual(['や', null, 'ゆ', null, 'よ']);
    expect(rows[8]?.map((c) => c?.char ?? null)).toEqual(['ら', 'り', 'る', 'れ', 'ろ']);
    expect(rows[9]?.map((c) => c?.char ?? null)).toEqual(['わ', null, null, null, 'を']);
    expect(rows[10]?.map((c) => c?.char ?? null)).toEqual(['ん', null, null, null, null]);
  });

  it('o katakana tem as mesmas 46 letras; os com ten-ten e maru são 25 (mais o ヴ)', () => {
    expect(chartRows('kata', 'base').flat().filter(Boolean)).toHaveLength(46);
    expect(chartChars('hira', 'daku')).toHaveLength(25);
    expect(chartChars('kata', 'daku')).toHaveLength(26);
    expect(chartRows('hira', 'daku').every((r) => r.length === 5)).toBe(true);
  });

  it('cada letra da tabela traz o romaji e uma dica de memória (exceto o ヴ)', () => {
    const missing = [...chartRows('hira', 'base').flat(), ...chartRows('kata', 'base').flat()].flatMap((c) => (c && !KANA_MNEMONICS[c.char] ? [c.char] : []));
    expect(missing).toEqual([]);
    for (const cell of chartRows('kata', 'daku').flat()) if (cell && cell.char !== 'ヴ') expect(KANA_MNEMONICS[cell.char]).toBeTruthy();
  });
});

describe('pares parecidos', () => {
  it('todo caractere existe no app, na escrita indicada, e cada par tem uma dica de verdade', () => {
    for (const l of LOOKALIKES) {
      expect(l.chars.length).toBeGreaterThanOrEqual(2);
      for (const c of l.chars) expect(KANA.find((k) => k.char === c)?.script).toBe(l.script);
      expect(l.tip.length).toBeGreaterThan(30);
    }
    expect(new Set(LOOKALIKES.map((l) => l.id)).size).toBe(LOOKALIKES.length);
  });

  it('cobre hiragana e katakana', () => {
    expect(LOOKALIKES.some((l) => l.script === 'hira')).toBe(true);
    expect(LOOKALIKES.some((l) => l.script === 'kata')).toBe(true);
  });
});
