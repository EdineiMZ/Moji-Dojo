import { COMPARE_PHRASES, wavSeconds } from './voiceCompare';

jest.mock('./nativeAudio', () => ({ playFile: jest.fn(() => true) }));

describe('comparar vozes', () => {
  it('a duração do WAV sai do tamanho do arquivo', () => {
    expect(wavSeconds(44)).toBe(0);
    expect(wavSeconds(44 + 44100)).toBe(1);
    expect(wavSeconds(10)).toBe(0);
  });

  it('as frases de comparação são japonês de verdade e têm rótulo', () => {
    for (const p of COMPARE_PHRASES) {
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.text).toMatch(/[぀-ヿ]/);
    }
    expect(new Set(COMPARE_PHRASES.map((p) => p.value)).size).toBe(COMPARE_PHRASES.length);
  });
});
