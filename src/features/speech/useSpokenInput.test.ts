import { pickTranscript, speechErrorMessage } from './useSpokenInput';

jest.mock('expo-speech-recognition', () => ({ ExpoSpeechRecognitionModule: {}, useSpeechRecognitionEvent: jest.fn() }));

describe('entrada por voz', () => {
  it('escolhe a primeira transcrição não vazia, sem espaços e no tamanho máximo', () => {
    expect(pickTranscript([{ transcript: '  ' }, { transcript: ' こんにちは ' }, { transcript: 'こんばんは' }], 80)).toBe('こんにちは');
    expect(pickTranscript([{ transcript: 'あいうえお' }], 3)).toBe('あいう');
    expect(pickTranscript([], 80)).toBe('');
    expect(pickTranscript([{ transcript: '' }], 80)).toBe('');
  });

  it('cada erro tem uma mensagem pronta', () => {
    expect(speechErrorMessage('no-speech')).toMatch(/Não ouvi nada/);
    expect(speechErrorMessage('not-allowed')).toMatch(/permissão/);
    expect(speechErrorMessage('network')).toMatch(/falhou/);
  });
});
