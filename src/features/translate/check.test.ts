import { checkAnswer, diffTyped, editDistance, normalizeJapanese } from './check';

describe('normalizeJapanese', () => {
  it('ignora espaços e pontuação, de largura inteira ou não', () => {
    expect(normalizeJapanese('わたしは ねこです。')).toBe('わたしはねこです');
    expect(normalizeJapanese('わたしは　ねこです！？')).toBe('わたしはねこです');
    expect(normalizeJapanese('「これは、すしですか」')).toBe('これはすしですか');
  });

  it('katakana e hiragana valem o mesmo, e a largura é normalizada', () => {
    expect(normalizeJapanese('コーヒー')).toBe('こーひー');
    expect(normalizeJapanese('ｺｰﾋｰ')).toBe('こーひー');
    expect(normalizeJapanese('ＴＯＭ')).toBe('tom');
  });
});

describe('editDistance', () => {
  it.each([
    ['あい', 'あい', 0],
    ['あい', 'あ', 1],
    ['あい', 'あう', 1],
    ['', 'あいう', 3],
    ['たべます', 'たべません', 2],
  ])('%s ↔ %s = %i', (a, b, d) => {
    expect(editDistance(a, b)).toBe(d);
  });
});

describe('diffTyped', () => {
  it('marca o que sobrou', () => {
    expect(diffTyped('たべまます', 'たべます')).toEqual([
      { text: 'たべま', kind: 'ok' },
      { text: 'ま', kind: 'extra' },
      { text: 'す', kind: 'ok' },
    ]);
  });

  it('tudo certo vira um pedaço só; o que faltou não aparece', () => {
    expect(diffTyped('たべます', 'たべます')).toEqual([{ text: 'たべます', kind: 'ok' }]);
    expect(diffTyped('たべ', 'たべます')).toEqual([{ text: 'たべ', kind: 'ok' }]);
  });
});

describe('checkAnswer', () => {
  const accepted = ['わたしは ねこです', '私は猫です'];

  it('aceita a escrita em kana, com kanji, em katakana e sem espaços', () => {
    for (const input of ['わたしは ねこです', 'わたしはねこです。', '私は猫です', 'ワタシハネコデス', 'わたしは　ねこです']) {
      expect(checkAnswer(input, accepted).verdict).toBe('ok');
    }
  });

  it('um erro pequeno é "quase" e mostra o que sobrou', () => {
    const result = checkAnswer('わたしはねこでず', ['わたしは ねこです']);
    expect(result.verdict).toBe('close');
    expect(result.closest).toBe('わたしは ねこです');
    expect(result.pieces.some((p) => p.kind === 'extra')).toBe(true);
  });

  it('muito diferente é errado', () => {
    expect(checkAnswer('いぬがすき', accepted).verdict).toBe('wrong');
  });

  it('vazio não conta como resposta', () => {
    expect(checkAnswer('  ', accepted).verdict).toBe('empty');
  });

  it('escolhe a resposta aceita mais parecida', () => {
    const result = checkAnswer('私は猫でず', accepted);
    expect(result.closest).toBe('私は猫です');
  });

  it('avisa quando parece que o teclado está em letras latinas', () => {
    expect(checkAnswer('watashi wa neko desu', accepted).tip).toMatch(/letras latinas/);
    expect(checkAnswer('いぬ', accepted).tip).toBeNull();
  });
});
