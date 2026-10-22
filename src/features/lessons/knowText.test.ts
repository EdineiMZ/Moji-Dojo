import { getItem } from '@/features/catalog';
import { comboExplanation, formatReadings, isCombo } from './knowText';

describe('comboExplanation', () => {
  it('explica きゃ a partir de き + ゃ', () => {
    expect(comboExplanation(getItem('きゃ'))).toBe(
      'き (ki) + ゃ pequeno = kya. O kana pequeno se junta ao anterior e os dois viram uma sílaba só.',
    );
  });

  it('funciona para katakana', () => {
    expect(comboExplanation(getItem('シャ'))).toContain('シ (shi) + ャ pequeno = sha');
  });
});

describe('isCombo / formatReadings', () => {
  it('só caracteres de um símbolo não são combinação', () => {
    expect(isCombo(getItem('きゃ'))).toBe(true);
    expect(isCombo(getItem('き'))).toBe(false);
    expect(isCombo(getItem('水'))).toBe(false);
  });

  it('junta as leituras e usa traço quando não há', () => {
    expect(formatReadings(['キュウ', 'ク'])).toBe('キュウ, ク');
    expect(formatReadings([])).toBe('—');
    expect(formatReadings(undefined)).toBe('—');
  });
});
