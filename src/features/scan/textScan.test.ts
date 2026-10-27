import { cleanLines, hasJapanese, recognizeText, scanAvailable } from './textScan';

describe('hasJapanese', () => {
  it('reconhece kana e kanji, e não confunde com letras latinas ou números', () => {
    expect(hasJapanese('ラーメン')).toBe(true);
    expect(hasJapanese('食べ物')).toBe(true);
    expect(hasJapanese('ひらがな')).toBe(true);
    expect(hasJapanese('Menu 123')).toBe(false);
    expect(hasJapanese('')).toBe(false);
  });
});

describe('cleanLines', () => {
  it('tira espaços sobrando, linhas vazias e linhas repetidas em sequência', () => {
    expect(cleanLines(['  ラーメン   ', '', 'ラーメン', '　　', '餃子 ８００円'])).toEqual(['ラーメン', '餃子 ８００円']);
  });

  it('descarta ruído curto sem japonês, mas mantém preços e números', () => {
    expect(cleanLines(['|', '·', '~', '800', '￥500'])).toEqual(['800', '￥500']);
  });

  it('mantém uma linha japonesa curta de uma letra', () => {
    expect(cleanLines(['出'])).toEqual(['出']);
  });
});

describe('sem o módulo nativo (testes, Expo Go, web)', () => {
  it('o leitor aparece como indisponível e recusa com uma mensagem clara', async () => {
    expect(scanAvailable).toBe(false);
    await expect(recognizeText('file:///x.jpg')).rejects.toThrow('sem o leitor de texto');
  });
});
