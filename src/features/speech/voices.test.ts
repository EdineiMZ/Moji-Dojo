import { isJapaneseLanguage, japaneseVoices, pickJapaneseVoice, speechText, spokenLength, voiceLabel, type VoiceInfo } from './voices';

const voice = (language: string, id = language): VoiceInfo => ({ identifier: id, name: id, language });

describe('isJapaneseLanguage', () => {
  it.each(['ja', 'ja-JP', 'ja_JP', 'JA-jp'])('aceita %s', (lang) => {
    expect(isJapaneseLanguage(lang)).toBe(true);
  });

  it.each(['', 'jav', 'jam-JM', 'pt-BR', 'en-US', 'zh-CN'])('recusa %s', (lang) => {
    expect(isJapaneseLanguage(lang)).toBe(false);
  });
});

describe('pickJapaneseVoice', () => {
  it('devolve null quando não há voz japonesa (ou nenhuma voz)', () => {
    expect(pickJapaneseVoice([])).toBeNull();
    expect(pickJapaneseVoice([voice('pt-BR'), voice('en-US')])).toBeNull();
  });

  it('acha a voz japonesa entre as outras', () => {
    const ja = voice('ja-JP', 'ja-jp-x-abc-local');
    expect(pickJapaneseVoice([voice('pt-BR'), ja, voice('ja_JP', 'outra')])).toBe(ja);
  });
});

describe('speechText', () => {
  it('um ou dois caracteres são repetidos com pausa, até somar três, porque a voz do Android fica muda com textos tão curtos', () => {
    expect(speechText('あ')).toBe('あ、あ、あ');
    expect(speechText('ン')).toBe('ン、ン、ン');
    expect(speechText(' い ')).toBe('い、い、い');
    expect(speechText('あい')).toBe('あい、あい');
    expect(speechText('いえ')).toBe('いえ、いえ');
    expect(speechText('日')).toBe('日、日、日');
    expect(speechText('箸')).toBe('箸、箸、箸');
  });

  it('três letras ou mais saem normalmente; o traço longo não conta como letra', () => {
    expect(speechText('ふじさん')).toBe('ふじさん');
    expect(speechText('きゃ')).toBe('きゃ、きゃ');
    expect(speechText('ビール')).toBe('ビール、ビール');
    expect(speechText('らーめん')).toBe('らーめん');
  });

  it('a segunda tentativa reforça: repete até quatro letras e fecha com ponto', () => {
    expect(speechText('ふじさん', true)).toBe('ふじさん、ふじさん。');
    expect(speechText('ありがとうございます', true)).toBe('ありがとうございます。');
    expect(speechText('あ', true)).toBe('あ、あ、あ');
  });

  it('o apoio entre parênteses não é falado', () => {
    expect(speechText('はし (箸)')).toBe('はし、はし');
    expect(speechText('ふじさん (富士山)')).toBe('ふじさん');
    expect(speechText('あめ（雨）')).toBe('あめ、あめ');
  });

  it('uma barra entre alternativas vira pausa', () => {
    expect(speechText('はい / いいえ')).toBe('はい。いいえ');
    expect(speechText('はい/いいえ')).toBe('はい。いいえ');
  });

  it('texto sem barra não muda', () => {
    expect(speechText('ありがとうございます')).toBe('ありがとうございます');
  });

  it('sem nada para falar, devolve o texto limpo', () => {
    expect(speechText('  ')).toBe('');
    expect(spokenLength('。、 ')).toBe(0);
  });
});

describe('escolha da voz', () => {
  const plain = { identifier: 'ja-jp-x-jac-local', name: 'a', language: 'ja-JP', quality: 'Default' };
  const best = { identifier: 'ja-jp-x-jad-network', name: 'b', language: 'ja-JP', quality: 'Enhanced' };

  it('a automática prefere a de melhor qualidade', () => {
    expect(japaneseVoices([plain, voice('pt-BR'), best]).map((v) => v.identifier)).toEqual([best.identifier, plain.identifier]);
    expect(pickJapaneseVoice([plain, best])).toBe(best);
  });

  it('a escolhida vale se ainda existir; senão volta para a automática', () => {
    expect(pickJapaneseVoice([plain, best], plain.identifier)).toBe(plain);
    expect(pickJapaneseVoice([plain, best], 'sumiu')).toBe(best);
    expect(pickJapaneseVoice([], 'sumiu')).toBeNull();
  });

  it('o nome na lista diz a qualidade e se é online', () => {
    expect(voiceLabel(best, 0)).toBe('Voz 1 (melhor qualidade, online)');
    expect(voiceLabel(plain, 1)).toBe('Voz 2 (no aparelho)');
    expect(voiceLabel(voice('ja-JP', 'x'), 2)).toBe('Voz 3');
  });
});
