import { isJapaneseLanguage, pickJapaneseVoice, speechText, type VoiceInfo } from './voices';

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
  it('uma barra entre alternativas vira pausa', () => {
    expect(speechText('はい / いいえ')).toBe('はい。いいえ');
    expect(speechText('はい/いいえ')).toBe('はい。いいえ');
  });

  it('texto sem barra não muda', () => {
    expect(speechText('ありがとうございます')).toBe('ありがとうございます');
  });
});
