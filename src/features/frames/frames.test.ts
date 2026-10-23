import { ALL_TRAVEL_PHRASES } from '@/content/travel';
import { FRAMES, fillFrame } from './frames';

describe('fábrica de frases', () => {
  it('cada molde tem palavras e gera frases sem espaços duplos, com romaji e tradução', () => {
    expect(FRAMES.length).toBeGreaterThanOrEqual(10);
    for (const frame of FRAMES) {
      expect(frame.words.length).toBeGreaterThanOrEqual(6);
      for (const word of frame.words) {
        const out = fillFrame(frame, word);
        expect(out.jp).not.toMatch(/ {2}|^ | $/);
        expect(out.jp).toMatch(/^[ぁ-んァ-ヶー ]+$/);
        expect(out.romaji).toMatch(/^[a-zāīūēō ]+$/i);
        expect(out.pt).not.toMatch(/[{}]/);
      }
    }
  });

  it('palavras repetidas dentro de um molde não existem', () => {
    for (const frame of FRAMES) expect(new Set(frame.words.map((x) => x.jp)).size).toBe(frame.words.length);
  });

  it('reproduz frases de viagem que o app já tem (ignorando espaços), com o mesmo romaji', () => {
    const find = (id: string, jp: string) => fillFrame(FRAMES.find((f) => f.id === id)!, FRAMES.find((f) => f.id === id)!.words.find((x) => x.jp === jp)!);
    const check = (out: { jp: string; romaji: string }) => {
      const found = ALL_TRAVEL_PHRASES.find((p) => p.jp.replace(/ /g, '') === out.jp.replace(/ /g, ''));
      expect(found).toBeDefined();
      expect(out.romaji.replace(/ō/g, 'ō')).toBe(found?.romaji);
    };
    check(find('kudasai', 'メニュー'));
    check(find('doko', 'トイレ'));
    check(find('doko', 'びょういん'));
    check(find('ikura', 'これ'));
    check(find('tabemasen', 'さかな'));
    check(find('arerugi', 'えび'));
  });

  it('as traduções ficam naturais nos moldes com artigo', () => {
    const doko = FRAMES.find((f) => f.id === 'doko')!;
    expect(fillFrame(doko, doko.words[0]!).pt).toBe('Onde fica o banheiro?');
    const kudasai = FRAMES.find((f) => f.id === 'kudasai')!;
    expect(fillFrame(kudasai, kudasai.words[0]!).pt).toBe('Água, por favor');
  });
});
