import { isGood, judgeSpoken, pickSpeakItems, speakPool } from './speak';

describe('judgeSpoken', () => {
  const accepted = ['かんじを かきます', '漢字を書きます'];

  it('aceita a escrita em kanji que o reconhecedor devolve', () => {
    expect(judgeSpoken(['漢字を書きます'], accepted)).toEqual({ verdict: 'ok', heard: '漢字を書きます' });
  });

  it('fica com a melhor alternativa entre as que o reconhecedor deu', () => {
    const result = judgeSpoken(['完治を書きます', '漢字を書きます', '感じ'], accepted);
    expect(result.heard).toBe('漢字を書きます');
    expect(isGood(result.verdict)).toBe(true);
  });

  it('uma letra de diferença é "quase" e ainda conta como bom', () => {
    const result = judgeSpoken(['かんじを かきまず'], accepted);
    expect(result.verdict).toBe('close');
    expect(isGood(result.verdict)).toBe(true);
  });

  it('algo muito diferente não conta, e sem nenhuma alternativa não há veredito', () => {
    expect(isGood(judgeSpoken(['ありがとう'], accepted).verdict)).toBe(false);
    expect(judgeSpoken([], accepted)).toEqual({ verdict: 'empty', heard: '' });
  });
});

describe('frases para falar', () => {
  it('todas são curtas, têm a escrita com kanji aceita e não se repetem', () => {
    const pool = speakPool();
    expect(pool.length).toBeGreaterThan(200);
    expect(new Set(pool.map((i) => i.id)).size).toBe(pool.length);
    for (const item of pool) {
      expect([...item.jp.replace(/ /g, '')].length).toBeLessThanOrEqual(16);
      expect(item.kanji).toBeDefined();
    }
  });

  it('a rodada tem o número pedido', () => {
    expect(pickSpeakItems(6)).toHaveLength(6);
  });
});
