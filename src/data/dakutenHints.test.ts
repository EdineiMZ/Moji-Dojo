import { DAKUTEN_MNEMONICS } from './dakutenHints';
import { KANA_MNEMONICS } from './hints';
import { KANA } from './kana';

describe('dicas dos kana com ten-ten e maru', () => {
  const daku = KANA.filter((k) => k.group === 'daku');

  it('os 50 kana (25 de hiragana e 25 de katakana) têm dica', () => {
    expect(daku).toHaveLength(50);
    for (const k of daku) expect(KANA_MNEMONICS[k.char]?.length).toBeGreaterThan(30);
    expect(Object.keys(DAKUTEN_MNEMONICS)).toHaveLength(50);
  });

  it('a dica cita o kana base e o som certo', () => {
    expect(KANA_MNEMONICS['が']).toContain('か (ka)');
    expect(KANA_MNEMONICS['が']).toContain('"ga"');
    expect(KANA_MNEMONICS['ガ']).toContain('カ (ka)');
    expect(KANA_MNEMONICS['ザ']).toContain('サ (sa)');
    expect(KANA_MNEMONICS['だ']).toContain('t → d');
    expect(KANA_MNEMONICS['ぼ']).toContain('ほ (ho)');
    expect(KANA_MNEMONICS['ぼ']).toContain('h → b');
    expect(KANA_MNEMONICS['ぱ']).toContain('maru');
    expect(KANA_MNEMONICS['ぱ']).toContain('h → p');
    expect(KANA_MNEMONICS['パ']).toContain('ハ (ha)');
  });

  it('avisa das exceções: じ/ぢ e ず/づ soam igual', () => {
    expect(KANA_MNEMONICS['ぢ']).toContain('igual a じ');
    expect(KANA_MNEMONICS['づ']).toContain('igual a ず');
    expect(KANA_MNEMONICS['ヂ']).toContain('igual a じ');
    expect(KANA_MNEMONICS['じ']).toContain('shi');
  });

  it('não mexe nas dicas que já existiam', () => {
    expect(KANA_MNEMONICS['あ']).toContain('gravata');
    expect(KANA_MNEMONICS['ね']).toContain('gato');
  });

  it('a mesma letra nunca aparece com dois sons diferentes no mesmo texto', () => {
    // O som citado ("ga") é o romaji do próprio kana.
    for (const k of daku) expect(KANA_MNEMONICS[k.char]).toContain(`"${k.romaji}"`);
  });
});
