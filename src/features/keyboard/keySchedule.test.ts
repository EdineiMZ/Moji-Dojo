import { DAY_MS } from '@/features/review/fsrs';
import { dueChars, FAST_MS, gradeOf, keyRecall, nextKeyDue, scheduleKey, SLOW_MS } from './keySchedule';
import { EMPTY_TYPING, recordKey, sanitizeTyping, type KeyStat, type TypingProgress } from './typingStats';

const T0 = 1_800_000_000_000;

describe('nota de uma letra', () => {
  it('erro é 1, devagar 2, normal 3 e rápido 4', () => {
    expect(gradeOf(false, 100)).toBe(1);
    expect(gradeOf(true, SLOW_MS)).toBe(2);
    expect(gradeOf(true, 1500)).toBe(3);
    expect(gradeOf(true, FAST_MS)).toBe(4);
    expect(gradeOf(true, 0)).toBe(3); // sem tempo medido (primeira letra do item)
  });
});

describe('agendamento por letra', () => {
  const fresh: KeyStat = { ok: 0, bad: 0, ms: 0 };

  it('o primeiro acerto agenda a volta em dias; o primeiro erro, em 10 minutos', () => {
    const good = scheduleKey(fresh, true, 1500, T0);
    expect(good?.due).toBeGreaterThan(T0 + DAY_MS);
    const bad = scheduleKey(fresh, false, 0, T0);
    expect(bad?.due).toBe(T0 + 10 * 60_000);
  });

  it('outro acerto na mesma sessão não muda nada; um erro muda sempre', () => {
    const first = scheduleKey(fresh, true, 1500, T0)!;
    const stat: KeyStat = { ok: 1, bad: 0, ms: 1500, ...first };
    expect(scheduleKey(stat, true, 1500, T0 + 60_000)).toBeUndefined();
    const lapse = scheduleKey(stat, false, 0, T0 + 60_000);
    expect(lapse?.due).toBe(T0 + 60_000 + 10 * 60_000);
    expect(lapse!.s).toBeLessThan(first.s);
  });

  it('acertar de novo no dia certo aumenta o intervalo', () => {
    const first = scheduleKey(fresh, true, 1500, T0)!;
    const stat: KeyStat = { ok: 1, bad: 0, ms: 1500, ...first };
    const again = scheduleKey(stat, true, 1500, first.due)!;
    expect(again.s).toBeGreaterThan(first.s);
    expect(again.due - first.due).toBeGreaterThan(first.due - T0);
  });

  it('recordKey só agenda quando a hora é conhecida', () => {
    expect(recordKey(EMPTY_TYPING, 'か', true, 500).keys['か']).toEqual({ ok: 1, bad: 0, ms: 500 });
    const t = recordKey(EMPTY_TYPING, 'か', true, 500, T0);
    expect(t.keys['か']?.due).toBeGreaterThan(T0);
    expect(t.keys['か']?.ok).toBe(1);
  });
});

describe('letras para rever', () => {
  const typing = (keys: TypingProgress['keys']): TypingProgress => ({ ...EMPTY_TYPING, keys });

  it('lista as vencidas (a que mais se esquece primeiro), depois as antigas com erro, e ignora o que ainda não venceu', () => {
    const t = typing({
      か: { ok: 3, bad: 0, ms: 3000, s: 1, d: 5, at: T0, due: T0 + DAY_MS }, // venceu há 2 dias
      き: { ok: 3, bad: 0, ms: 3000, s: 30, d: 5, at: T0, due: T0 + 30 * DAY_MS }, // longe
      く: { ok: 1, bad: 0, ms: 900, s: 1, d: 5, at: T0 + 2 * DAY_MS, due: T0 + 3 * DAY_MS }, // venceu agora
      け: { ok: 1, bad: 4, ms: 500 }, // sem agendamento, mas errada
      こ: { ok: 5, bad: 0, ms: 5000 }, // sem agendamento e sem erro: não entra
    });
    const now = T0 + 3 * DAY_MS;
    expect(dueChars(t, now)).toEqual(['か', 'く', 'け']);
    expect(dueChars(t, now, 1)).toEqual(['か']);
    expect(nextKeyDue(t, now)).toBe(T0 + 30 * DAY_MS);
    expect(nextKeyDue(EMPTY_TYPING, now)).toBeNull();
  });

  it('a chance de lembrar cai com o tempo e é 0 sem agendamento', () => {
    const stat: KeyStat = { ok: 1, bad: 0, ms: 0, s: 2, d: 5, at: T0, due: T0 + 2 * DAY_MS };
    expect(keyRecall(stat, T0)).toBeCloseTo(1, 5);
    expect(keyRecall(stat, T0 + 10 * DAY_MS)).toBeLessThan(keyRecall(stat, T0 + DAY_MS));
    expect(keyRecall({ ok: 1, bad: 0, ms: 0 }, T0)).toBe(0);
  });
});

describe('leitura do disco', () => {
  it('guarda o agendamento válido e descarta o incompleto ou fora do intervalo', () => {
    const clean = sanitizeTyping({
      keys: {
        か: { ok: 1, bad: 0, ms: 0, s: 2, d: 5, at: T0, due: T0 + DAY_MS },
        き: { ok: 1, bad: 0, ms: 0, s: 2, d: 5 },
        く: { ok: 1, bad: 0, ms: 0, s: 2, d: 99, at: T0, due: T0 },
      },
    });
    expect(clean.keys['か']).toEqual({ ok: 1, bad: 0, ms: 0, s: 2, d: 5, at: T0, due: T0 + DAY_MS });
    expect(clean.keys['き']).toEqual({ ok: 1, bad: 0, ms: 0 });
    expect(clean.keys['く']).toEqual({ ok: 1, bad: 0, ms: 0 });
  });
});
