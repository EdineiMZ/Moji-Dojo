import { ALL_TRAVEL_PHRASES } from '@/content/travel';
import { CONFIRMED } from '@/content/confirmed';
import { confidenceOf } from './confidence';

describe('confirmação das frases', () => {
  it('uma frase conhecida e comum está confirmada, e uma inexistente fica pendente', () => {
    expect(confidenceOf('トイレは どこ ですか').level === 'frase' || confidenceOf('トイレは どこですか').level === 'frase').toBe(true);
    expect(confidenceOf('こんにちは').level).toBe('frase');
    expect(confidenceOf('あいうえお かきくけこ').level).toBe('pendente');
  });

  it('a maior parte das frases de viagem tem alguma confirmação', () => {
    const covered = ALL_TRAVEL_PHRASES.filter((p) => confidenceOf(p.jp).level !== 'pendente').length;
    expect(covered / ALL_TRAVEL_PHRASES.length).toBeGreaterThan(0.7);
  });

  it('todo item confirmado traz a fonte', () => {
    for (const c of Object.values(CONFIRMED)) {
      expect(c.source).toMatch(/^(Tatoeba #\d+|Wikivoyage)$/);
    }
  });
});
