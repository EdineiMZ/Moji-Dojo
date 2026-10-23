import { DAILY_CAP, lessonReward, openBonus, sessionReward } from './economy';
import {
  claimWeekChest,
  clearMiss,
  onAnswer,
  onDialogDone,
  onLesson,
  onNewWords,
  onOpen,
  onPhrase,
  onRecording,
  onSession,
  recordMiss,
  roll,
  weekChestReady,
  type EventContext,
} from './events';
import { addPetals, emptyJourney, MAX_MISSES } from './journey';
import { levelOf, levelProgress, titleFor, xpForLevel } from './levels';
import { challengeFor, CHALLENGE_GROUPS, MISSIONS, missionsFor } from './missions';
import { daysStudiedInWeek, mondayOf, weekDays, weekIndex, weekKey } from './week';

// Quarta-feira, 21/10/2026, meio-dia.
const NOW = new Date(2026, 9, 21, 12);

const ctx = (extra: Partial<EventContext> = {}): EventContext => ({
  now: NOW,
  streak: 1,
  bestStreak: 1,
  weekDays: 1,
  wordsLearned: 0,
  topicsMastered: 0,
  hiraDone: false,
  kataDone: false,
  phrasesCount: 0,
  ...extra,
});

describe('semana', () => {
  it('a semana vai de segunda a domingo', () => {
    expect(weekKey(new Date(2026, 9, 21))).toBe('2026-10-19');
    expect(weekKey(new Date(2026, 9, 25))).toBe('2026-10-19');
    expect(weekKey(new Date(2026, 9, 26))).toBe('2026-10-26');
    expect(mondayOf(new Date(2026, 9, 25)).getDate()).toBe(19);
    expect(weekIndex(new Date(2026, 9, 26))).toBe(weekIndex(new Date(2026, 9, 19)) + 1);
  });

  it('conta os dias estudados na semana e marca o calendário', () => {
    const days = ['2026-10-18', '2026-10-19', '2026-10-21', '2026-10-27'];
    expect(daysStudiedInWeek(days, NOW)).toBe(2);
    const week = weekDays(days, NOW);
    expect(week.map((d) => d.studied)).toEqual([true, false, true, false, false, false, false]);
    expect(week.map((d) => d.future)).toEqual([false, false, false, true, true, true, true]);
  });
});

describe('economia', () => {
  it('o bônus de abrir é 5 mais a sequência, até 10', () => {
    expect(openBonus(0)).toBe(5);
    expect(openBonus(3)).toBe(8);
    expect(openBonus(50)).toBe(15);
  });

  it('lição: base 10 mais a nota; a fila de perfeitas aumenta o ganho; erro zera a fila', () => {
    expect(lessonReward(10, 10, 0, false)).toMatchObject({ petals: 20, perfect: true, perfectRun: 1 });
    expect(lessonReward(10, 10, 1, false).petals).toBe(22);
    expect(lessonReward(10, 10, 5, false).petals).toBe(30);
    expect(lessonReward(10, 10, 30, false).petals).toBe(30);
    expect(lessonReward(9, 10, 4, false)).toMatchObject({ petals: 16, perfect: false, perfectRun: 0 });
    expect(lessonReward(7, 10, 0, false).petals).toBe(13);
    expect(lessonReward(6, 10, 0, false).petals).toBe(10);
  });

  it('repetir a lição no dia vale metade e não aumenta a fila', () => {
    const repeat = lessonReward(10, 10, 3, true);
    expect(repeat.petals).toBe(10);
    expect(repeat.perfectRun).toBe(3);
  });

  it('revisão: 5 de base e 8 / 5 / 2 pela nota', () => {
    expect(sessionReward(20, 20).petals).toBe(13);
    expect(sessionReward(18, 20).petals).toBe(10);
    expect(sessionReward(15, 20).petals).toBe(7);
    expect(sessionReward(10, 20).petals).toBe(5);
    expect(sessionReward(0, 0).petals).toBe(0);
  });
});

describe('níveis', () => {
  it('a experiência vira nível: 50 para o 2, 200 para o 3', () => {
    expect(levelOf(0)).toBe(1);
    expect(levelOf(49)).toBe(1);
    expect(levelOf(50)).toBe(2);
    expect(levelOf(199)).toBe(2);
    expect(levelOf(200)).toBe(3);
    expect(xpForLevel(5)).toBe(800);
    expect(levelProgress(125)).toEqual({ level: 2, into: 75, span: 150 });
  });

  it('o título muda por faixa', () => {
    expect(titleFor(1)).toBe('Broto');
    expect(titleFor(4)).toBe('Aprendiz');
    expect(titleFor(25)).toBe('Mestre do Dojo');
  });
});

describe('abrir o app', () => {
  it('dá o bônus uma vez por dia e avisa', () => {
    const first = onOpen(emptyJourney(), ctx({ streak: 2 }));
    expect(first.petals).toBe(7);
    expect(first.today.opened).toBe(true);
    expect(first.toasts.some((t) => t.title === 'Baú do dia 🎁')).toBe(true);
    expect(onOpen(first, ctx({ streak: 2 })).petals).toBe(7);
  });

  it('no dia seguinte dá de novo, e uma pausa longa vira "de volta ao dojo"', () => {
    const day1 = onOpen(emptyJourney(), ctx());
    const tomorrow = new Date(2026, 9, 28, 12);
    const back = onOpen(day1, ctx({ now: tomorrow, daysAway: 6 }));
    expect(back.petals).toBeGreaterThan(day1.petals);
    expect(back.achievements.comeback).toBeDefined();
  });
});

describe('lições', () => {
  it('uma lição perfeita paga, soma experiência, conta e libera a primeira conquista', () => {
    const state = onLesson(emptyJourney(), ctx(), { lessonId: 'hira:L0', first: 10, total: 10 });
    expect(state.counters.lessons).toBe(1);
    expect(state.counters.perfectLessons).toBe(1);
    expect(state.perfectRun).toBe(1);
    expect(state.xp).toBeGreaterThanOrEqual(30);
    expect(state.achievements['lessons-1']).toBeDefined();
    expect(state.achievements['perfect-1']).toBeDefined();
    expect(state.petals).toBeGreaterThanOrEqual(20);
  });

  it('repetir a mesma lição no dia vale metade e não conta de novo', () => {
    const first = onLesson(emptyJourney(), ctx(), { lessonId: 'hira:L0', first: 10, total: 10 });
    const again = onLesson(first, ctx(), { lessonId: 'hira:L0', first: 10, total: 10 });
    expect(again.counters.lessons).toBe(1);
    expect(again.today.earned - first.today.earned).toBe(10);
  });

  it('errar quebra a fila de perfeitas, e a melhor fila fica guardada', () => {
    let state = emptyJourney();
    for (let i = 0; i < 3; i++) state = onLesson(state, ctx(), { lessonId: `L${i}`, first: 5, total: 5 });
    expect(state.perfectRun).toBe(3);
    state = onLesson(state, ctx(), { lessonId: 'L9', first: 4, total: 5 });
    expect(state.perfectRun).toBe(0);
    expect(state.bestPerfectRun).toBe(3);
  });

  it('o teto do dia limita as pétalas de lição', () => {
    let state = emptyJourney();
    for (let i = 0; i < 40; i++) state = onLesson(state, ctx(), { lessonId: `L${i}`, first: 5, total: 5 });
    expect(state.today.earned).toBe(DAILY_CAP);
    const lessonPetals = state.petals - state.achievements['lessons-1']! * 0;
    expect(lessonPetals).toBeGreaterThanOrEqual(DAILY_CAP);
    const before = state.today.earned;
    state = onLesson(state, ctx(), { lessonId: 'extra', first: 5, total: 5 });
    expect(state.today.earned).toBe(before);
  });

  it('dez lições perfeitas seguidas dão a conquista da lanterna', () => {
    let state = emptyJourney();
    for (let i = 0; i < 10; i++) state = onLesson(state, ctx(), { lessonId: `L${i}`, first: 5, total: 5 });
    expect(state.achievements['perfect-run-10']).toBeDefined();
    expect(state.owned).toContain('lanterna');
  });
});

describe('respostas', () => {
  it('somam experiência e contadores; acertar vale mais que errar', () => {
    const ok = onAnswer(emptyJourney(), ctx(), { ok: true, area: 'kana' });
    const bad = onAnswer(emptyJourney(), ctx(), { ok: false, area: 'kana' });
    expect(ok.xp).toBe(2);
    expect(bad.xp).toBe(1);
    expect(ok.counters.correct).toBe(1);
    expect(bad.counters.correct).toBeUndefined();
    expect(ok.today.counts.answers).toBe(1);
  });

  it('a meta diária de respostas rende 5 pétalas, uma vez só', () => {
    let state: ReturnType<typeof emptyJourney> = { ...emptyJourney(), dailyGoal: 5 };
    for (let i = 0; i < 4; i++) state = onAnswer(state, ctx(), { ok: true, area: 'kana' });
    expect(state.today.goalDone).toBe(false);
    state = onAnswer(state, ctx(), { ok: true, area: 'kana' });
    expect(state.today.goalDone).toBe(true);
    const petals = state.petals;
    state = onAnswer(state, ctx(), { ok: true, area: 'kana' });
    expect(state.petals).toBe(petals);
  });

  it('ditado e compreensão contam como ouvido; falar só conta quando acerta', () => {
    let state = onAnswer(emptyJourney(), ctx(), { ok: false, area: 'dictation' });
    state = onAnswer(state, ctx(), { ok: true, area: 'understand' });
    expect(state.today.counts.listen).toBe(2);
    expect(state.counters.dictations).toBe(1);
    state = onAnswer(state, ctx(), { ok: false, area: 'speak' });
    expect(state.counters.speaks).toBeUndefined();
    state = onAnswer(state, ctx(), { ok: true, area: 'speak' });
    expect(state.counters.speaks).toBe(1);
  });

  it('o desafio da semana conta só acertos de palavras do grupo da semana e paga ao chegar na meta', () => {
    const { group, goal, petals } = challengeFor(NOW);
    expect(CHALLENGE_GROUPS).toContain(group);
    let state = emptyJourney();
    state = onAnswer(state, ctx(), { ok: true, area: 'vocab', group: 'Outro grupo' });
    state = onAnswer(state, ctx(), { ok: false, area: 'vocab', group });
    expect(state.week.challenge).toBe(0);
    for (let i = 0; i < goal; i++) state = onAnswer(state, ctx(), { ok: true, area: 'vocab', group });
    expect(state.week.challengeClaimed).toBe(true);
    expect(state.toasts.some((t) => t.title === 'Desafio da semana cumprido')).toBe(true);
    const before = state.petals;
    state = onAnswer(state, ctx(), { ok: true, area: 'vocab', group });
    expect(state.petals).toBe(before);
    expect(petals).toBeGreaterThan(0);
  });
});

describe('missões do dia', () => {
  it('são 3, diferentes, e as mesmas para o mesmo dia', () => {
    const a = missionsFor('2026-10-21');
    expect(a).toHaveLength(3);
    expect(new Set(a.map((m) => m.id)).size).toBe(3);
    expect(missionsFor('2026-10-21')).toEqual(a);
    const different = new Set(Array.from({ length: 30 }, (_, i) => missionsFor(`2026-11-${String(i + 1).padStart(2, '0')}`).map((m) => m.id).join()));
    expect(different.size).toBeGreaterThan(5);
  });

  it('cumprir uma missão a resgata sozinha, com pétalas e aviso; resgatar as 3 dá o bônus', () => {
    let state = roll(emptyJourney(), NOW);
    const today = missionsFor(state.today.day);
    const counters: Record<string, number> = Object.fromEntries(today.map((m) => [m.counter, m.goal]));
    state = { ...state, today: { ...state.today, counts: counters } };
    state = onNewWords(state, ctx(), 0);
    expect(state.today.claimed.sort()).toEqual(today.map((m) => m.id).sort());
    expect(state.toasts.some((t) => t.title === 'Todas as missões!')).toBe(true);
    expect(state.petals).toBeGreaterThanOrEqual(3 * 10 + 20);
    const petals = state.petals;
    expect(onNewWords(state, ctx(), 0).petals).toBe(petals);
  });

  it('todas as missões existem com meta positiva e contador', () => {
    for (const m of MISSIONS) {
      expect(m.goal).toBeGreaterThan(0);
      expect(m.counter.length).toBeGreaterThan(0);
    }
  });
});

describe('sessão, frase, gravação e diálogo', () => {
  it('a revisão do dia paga e conta; perfeita conta para a missão "perfeita"', () => {
    const state = onSession(emptyJourney(), ctx(), { first: 20, total: 20 });
    expect(state.today.counts.sessions).toBe(1);
    expect(state.today.counts.perfect).toBe(1);
    expect(state.petals).toBeGreaterThanOrEqual(13);
  });

  it('frase própria, gravação e diálogo perfeito alimentam conquistas', () => {
    let state = onPhrase(emptyJourney(), ctx({ phrasesCount: 1 }));
    expect(state.achievements['phrases-1']).toBeDefined();
    state = onRecording(state, ctx());
    expect(state.achievements['recordings-1']).toBeDefined();
    expect(state.owned).toContain('microfone');
    state = onDialogDone(state, ctx(), true);
    expect(state.owned).toContain('fundo-torii');
    expect(onDialogDone(emptyJourney(), ctx(), false).counters.dialogsPerfect).toBeUndefined();
  });
});

describe('baú da semana', () => {
  it('só abre com os dias da meta, uma vez; o primeiro dá o laço e a partir daí itens em semanas alternadas', () => {
    const base = roll(emptyJourney(), NOW);
    expect(weekChestReady(base, { weekDays: 3 })).toBe(false);
    expect(claimWeekChest(base, ctx({ weekDays: 3 })).weeksWon).toBe(0);

    const first = claimWeekChest(base, ctx({ weekDays: 4 }));
    expect(first.weeksWon).toBe(1);
    expect(first.owned).toContain('laco-semana');
    expect(first.petals).toBeGreaterThanOrEqual(40);
    expect(claimWeekChest(first, ctx({ weekDays: 5 })).weeksWon).toBe(1);

    const nextWeek = new Date(2026, 9, 28, 12);
    const second = claimWeekChest(first, ctx({ now: nextWeek, weekDays: 4 }));
    expect(second.weeksWon).toBe(2);
    expect(second.owned.length).toBe(2);
    const third = claimWeekChest(second, ctx({ now: new Date(2026, 10, 4, 12), weekDays: 4 }));
    expect(third.weeksWon).toBe(3);
    expect(third.owned.length).toBe(2);
  });

  it('avisa que o baú está pronto uma vez só', () => {
    let state = onAnswer(emptyJourney(), ctx({ weekDays: 4 }), { ok: true, area: 'kana' });
    expect(state.toasts.filter((t) => t.title === 'Meta da semana batida!')).toHaveLength(1);
    state = onAnswer(state, ctx({ weekDays: 4 }), { ok: true, area: 'kana' });
    expect(state.toasts.filter((t) => t.title === 'Meta da semana batida!')).toHaveLength(1);
  });
});

describe('conquistas', () => {
  it('sequência de 7 dias dá a conquista, o item e o presente; dar de novo não repete', () => {
    const state = onAnswer(emptyJourney(), ctx({ streak: 7, bestStreak: 7 }), { ok: true, area: 'kana' });
    expect(state.achievements['streak-3']).toBeDefined();
    expect(state.achievements['streak-7']).toBeDefined();
    expect(state.owned).toContain('hachimaki-ganbare');
    const again = onAnswer(state, ctx({ streak: 7, bestStreak: 7 }), { ok: true, area: 'kana' });
    expect(again.owned.filter((id) => id === 'hachimaki-ganbare')).toHaveLength(1);
  });

  it('palavras, tópicos, hiragana e katakana completos liberam os itens', () => {
    const state = onAnswer(
      emptyJourney(),
      ctx({ wordsLearned: 100, topicsMastered: 10, hiraDone: true, kataDone: true }),
      { ok: true, area: 'kana' },
    );
    for (const id of ['oculos-sabio', 'chapeu-formatura', 'medalha-sol', 'gorro-carpa']) expect(state.owned).toContain(id);
  });

  it('subir de nível dá pétalas e aviso', () => {
    const state = onAnswer({ ...emptyJourney(), xp: 49 }, ctx(), { ok: true, area: 'kana' });
    expect(levelOf(state.xp)).toBe(2);
    expect(state.toasts.some((t) => t.kind === 'level')).toBe(true);
  });

  it('estudar de madrugada libera as conquistas escondidas', () => {
    const early = onAnswer(emptyJourney(), ctx({ now: new Date(2026, 9, 21, 5) }), { ok: true, area: 'kana' });
    expect(early.achievements['early-bird']).toBeDefined();
    expect(early.achievements['night-owl']).toBeUndefined();
    const night = onAnswer(emptyJourney(), ctx({ now: new Date(2026, 9, 21, 2) }), { ok: true, area: 'kana' });
    expect(night.achievements['night-owl']).toBeDefined();
  });

  it('o saldo de pétalas nunca fica negativo nem some com o fluxo normal', () => {
    let state = addPetals(emptyJourney(), 10);
    for (let i = 0; i < 25; i++) state = onAnswer(state, ctx(), { ok: i % 2 === 0, area: 'kana' });
    expect(state.petals).toBeGreaterThanOrEqual(10);
    expect(state.petalsEarned).toBe(state.petals);
  });
});

describe('erros recentes', () => {
  it('guardam sem repetir, respeitam o limite e saem quando corrigidos', () => {
    let state = recordMiss(emptyJourney(), 'srs:あ');
    state = recordMiss(state, 'vocab:学校|jm');
    state = recordMiss(state, 'srs:あ');
    expect(state.misses).toEqual(['vocab:学校|jm', 'srs:あ']);
    expect(clearMiss(state, 'srs:あ').misses).toEqual(['vocab:学校|jm']);
    for (let i = 0; i < MAX_MISSES + 20; i++) state = recordMiss(state, `srs:${i}`);
    expect(state.misses).toHaveLength(MAX_MISSES);
    expect(state.misses.at(-1)).toBe(`srs:${MAX_MISSES + 19}`);
  });
});
