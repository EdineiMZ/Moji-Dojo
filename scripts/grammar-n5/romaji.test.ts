// Este teste roda em Node, mas o projeto só carrega os tipos do Jest: declaramos só o que usamos.
const { kanaToRomaji, parseAnnotation, plainKana, stripPunctuation } = require('./romaji.cjs') as typeof import('./romaji');

describe('kanaToRomaji', () => {
  it.each([
    ['わたし', 'watashi'],
    ['ちゅうごく', 'chūgoku'],
    ['きょう', 'kyō'],
    ['おおきい', 'ōkii'],
    ['くうふく', 'kūfuku'],
    ['ありがとう', 'arigatō'],
    ['いいえ', 'iie'],
    ['せんせい', 'sensei'],
    ['きって', 'kitte'],
    ['こっち', 'kotchi'],
    ['ざっし', 'zasshi'],
    ['なんようび', "nan'yōbi"],
    ['しんぱい', 'shinpai'],
    ['ほんや', "hon'ya"],
    ['スキー', 'sukī'],
    ['コーヒー', 'kōhī'],
    ['テレビ', 'terebi'],
    ['じゅぎょう', 'jugyō'],
    ['しょくじ', 'shokuji'],
    ['フォーク', 'fōku'],
  ])('%s → %s', (kana, romaji) => {
    expect(kanaToRomaji(kana)).toBe(romaji);
  });

  it('は, へ e を são wa, e e o quando são partículas', () => {
    expect(kanaToRomaji('は', { particle: true })).toBe('wa');
    expect(kanaToRomaji('へ', { particle: true })).toBe('e');
    expect(kanaToRomaji('を', { particle: true })).toBe('o');
    expect(kanaToRomaji('では', { particle: true })).toBe('dewa');
    expect(kanaToRomaji('は')).toBe('ha');
  });
});

describe('parseAnnotation', () => {
  it('espaço separa nos dois, "|" só no romaji, "~" marca a partícula', () => {
    expect(parseAnnotation('わたし~は ねこ~では|ありません')).toEqual({
      jp: 'わたしは ねこではありません',
      romaji: 'watashi wa neko dewa arimasen',
    });
    expect(parseAnnotation('なに~を して|います~か')).toEqual({
      jp: 'なにを していますか',
      romaji: 'nani o shite imasu ka',
    });
  });

  it('a leitura do exemplo é a marcação sem separadores', () => {
    expect(plainKana('わたし~は ねこ~では|ありません')).toBe('わたしはねこではありません');
    expect(stripPunctuation('わたしは、ねこです。')).toBe('わたしはねこです');
  });
});
