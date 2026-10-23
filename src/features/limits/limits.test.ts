import { batchWithin, DEFAULT_LIMITS, limitLabel, newRoom, reviewRoom, room, sanitizeLimits } from './limits';
import { mochiLine, moodFor } from '../journey/mood';

describe('limites por dia', () => {
  it('0 é sem limite; senão sobra o que não foi feito', () => {
    expect(room(0, 100)).toBe(Infinity);
    expect(room(10, 4)).toBe(6);
    expect(room(10, 10)).toBe(0);
    expect(room(10, 25)).toBe(0);
  });

  it('lê os contadores do dia, sem limite por padrão', () => {
    expect(newRoom(DEFAULT_LIMITS, { newWords: 50 })).toBe(Infinity);
    expect(newRoom({ newPerDay: 10, reviewsPerDay: 0 }, { newWords: 7 })).toBe(3);
    expect(reviewRoom({ newPerDay: 0, reviewsPerDay: 30 }, { reviews: 12 })).toBe(18);
    expect(reviewRoom({ newPerDay: 0, reviewsPerDay: 30 }, {})).toBe(30);
  });

  it('o lote é o normal, ou menos quando o limite do dia está perto', () => {
    expect(batchWithin(20, Infinity)).toBe(20);
    expect(batchWithin(20, 7)).toBe(7);
    expect(batchWithin(20, 50)).toBe(20);
    expect(batchWithin(20, 0)).toBe(0);
  });

  it('só aceita as opções da lista; o resto volta a "sem limite"', () => {
    expect(sanitizeLimits({ newPerDay: 10, reviewsPerDay: 60 })).toEqual({ newPerDay: 10, reviewsPerDay: 60 });
    expect(sanitizeLimits({ newPerDay: 7, reviewsPerDay: 'x' })).toEqual(DEFAULT_LIMITS);
    expect(sanitizeLimits(null)).toEqual(DEFAULT_LIMITS);
    expect(limitLabel(0, 'palavras')).toBe('Sem limite');
    expect(limitLabel(10, 'palavras')).toBe('10 palavras');
  });
});

describe('humor do Mochi', () => {
  it('festa com sequência longa, feliz depois de estudar, tranquilo antes e com saudade depois de uma pausa', () => {
    expect(moodFor({ studiedToday: true, streak: 9, daysAway: 0 })).toBe('cheer');
    expect(moodFor({ studiedToday: true, streak: 2, daysAway: 0 })).toBe('happy');
    expect(moodFor({ studiedToday: false, streak: 5, daysAway: 1 })).toBe('thinking');
    expect(moodFor({ studiedToday: false, streak: 0, daysAway: 3 })).toBe('neutral');
    expect(moodFor({ studiedToday: false, streak: 0, daysAway: 4 })).toBe('sad');
  });

  it('as frases nunca cobram e trazem o número da sequência', () => {
    const lines = [
      mochiLine({ studiedToday: true, streak: 40, daysAway: 0 }),
      mochiLine({ studiedToday: true, streak: 8, daysAway: 0 }),
      mochiLine({ studiedToday: true, streak: 1, daysAway: 0 }),
      mochiLine({ studiedToday: false, streak: 5, daysAway: 1 }),
      mochiLine({ studiedToday: false, streak: 0, daysAway: 9 }),
      mochiLine({ studiedToday: false, streak: 0, daysAway: 1 }),
    ];
    for (const line of lines) expect(line).not.toMatch(/culpa|falhou|perdeu|preguiç|vergonha/i);
    expect(lines[0]).toContain('40');
    expect(lines[3]).toContain('5');
  });
});

describe('humor do Mochi: novos humores', () => {
  it('com sono de madrugada, orgulhoso com a meta batida e apaixonado em sequência muito longa', () => {
    expect(moodFor({ studiedToday: false, streak: 0, daysAway: 1, hour: 23 })).toBe('sleepy');
    expect(moodFor({ studiedToday: false, streak: 0, daysAway: 1, hour: 3 })).toBe('sleepy');
    expect(moodFor({ studiedToday: false, streak: 0, daysAway: 1, hour: 15 })).toBe('neutral');
    expect(moodFor({ studiedToday: true, streak: 2, daysAway: 0, goalDone: true })).toBe('proud');
    expect(moodFor({ studiedToday: true, streak: 40, daysAway: 0 })).toBe('love');
  });
});
