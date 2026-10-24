import { onAnswer, onExplored, onSession, roll, type EventContext } from './events';
import { emptyJourney, type JourneyState } from './journey';
import { MISSION_REWARDS, MISSIONS, missionsFor, rewardOf } from './missions';
import { trackAnswer, type TrackSlice } from './track';

// Quarta-feira, 21/10/2026, meio-dia.
const NOW = new Date(2026, 9, 21, 12);

const ctx = (): EventContext => ({
  now: NOW,
  streak: 1,
  bestStreak: 1,
  weekDays: 1,
  wordsLearned: 0,
  topicsMastered: 0,
  hiraDone: false,
  kataDone: false,
  phrasesCount: 0,
});

const answer = (state: JourneyState, ok: boolean, area: Parameters<typeof onAnswer>[2]['area'] = 'vocab'): JourneyState =>
  onAnswer(state, ctx(), { ok, area });

const start = () => roll(emptyJourney(), NOW);

describe('missões do dia: escolha', () => {
  it('toda missão tem id único, meta positiva e uma dificuldade', () => {
    expect(new Set(MISSIONS.map((m) => m.id)).size).toBe(MISSIONS.length);
    for (const m of MISSIONS) {
      expect(m.goal).toBeGreaterThan(0);
      expect(['easy', 'medium', 'hard']).toContain(m.difficulty);
    }
    for (const difficulty of ['easy', 'medium', 'hard'] as const) expect(MISSIONS.filter((m) => m.difficulty === difficulty).length).toBeGreaterThanOrEqual(6);
  });

  it('todo dia vêm uma fácil, uma média e uma difícil', () => {
    for (let d = 1; d <= 28; d++) {
      const day = `2026-11-${String(d).padStart(2, '0')}`;
      expect(missionsFor(day).map((m) => m.difficulty)).toEqual(['easy', 'medium', 'hard']);
    }
  });

  it('não repete a missão do dia anterior', () => {
    for (let d = 2; d <= 28; d++) {
      const today = missionsFor(`2026-11-${String(d).padStart(2, '0')}`).map((m) => m.id);
      const yesterday = missionsFor(`2026-11-${String(d - 1).padStart(2, '0')}`).map((m) => m.id);
      expect(today.filter((id) => yesterday.includes(id))).toEqual([]);
    }
  });

  it('missão difícil rende mais do que a fácil', () => {
    expect(MISSION_REWARDS.hard.petals).toBeGreaterThan(MISSION_REWARDS.medium.petals);
    expect(MISSION_REWARDS.medium.petals).toBeGreaterThan(MISSION_REWARDS.easy.petals);
    expect(rewardOf({ difficulty: 'hard' })).toEqual(MISSION_REWARDS.hard);
  });
});

describe('contadores das missões novas', () => {
  it('a sequência de acertos volta a zero no erro e guarda a melhor', () => {
    let state = start();
    for (let i = 0; i < 5; i++) state = answer(state, true);
    state = answer(state, false);
    for (let i = 0; i < 3; i++) state = answer(state, true);
    expect(state.today.counts.run).toBe(3);
    expect(state.today.counts.bestRun).toBe(5);
  });

  it('conta as áreas diferentes treinadas no dia (conjugação e partículas são a mesma área de gramática)', () => {
    let state = start();
    state = answer(state, true, 'vocab');
    state = answer(state, true, 'vocab');
    expect(state.today.counts.areas).toBe(1);
    state = answer(state, true, 'conj');
    state = answer(state, true, 'particle');
    state = answer(state, true, 'dictation');
    expect(state.today.counts.areas).toBe(3);
  });

  it('o acerto de 85% no dia só vale a partir de 30 respostas', () => {
    let state = start();
    for (let i = 0; i < 25; i++) state = answer(state, true);
    expect(state.today.counts.acc85).toBeUndefined();
    for (let i = 0; i < 4; i++) state = answer(state, true);
    expect(state.today.counts.acc85).toBeUndefined();
    state = answer(state, true);
    expect(state.today.counts.acc85).toBe(1);

    let weak = start();
    for (let i = 0; i < 30; i++) weak = answer(weak, i % 2 === 0);
    expect(weak.today.counts.acc85).toBeUndefined();
  });

  it('revisão com 90% de acerto e em até 5 minutos conta para as missões de desempenho', () => {
    const fastGood = onSession(start(), ctx(), { first: 18, total: 20, seconds: 240 });
    expect(fastGood.today.counts.sessions90).toBe(1);
    expect(fastGood.today.counts.fastSessions).toBe(1);

    const slowGood = onSession(start(), ctx(), { first: 19, total: 20, seconds: 600 });
    expect(slowGood.today.counts.sessions90).toBe(1);
    expect(slowGood.today.counts.fastSessions).toBeUndefined();

    const fastBad = onSession(start(), ctx(), { first: 12, total: 20, seconds: 120 });
    expect(fastBad.today.counts.sessions90).toBeUndefined();
    expect(fastBad.today.counts.fastSessions).toBeUndefined();

    // revisão curta demais não vale (10 perguntas ou mais)
    const tiny = onSession(start(), ctx(), { first: 5, total: 5, seconds: 30 });
    expect(tiny.today.counts.sessions90).toBeUndefined();
  });

  it('frases folheadas no Explorar somam para a missão', () => {
    let state = onExplored(start(), ctx(), 20);
    expect(state.today.counts.explored).toBe(20);
    state = onExplored(state, ctx(), 0);
    expect(state.today.counts.explored).toBe(20);
  });

  it('acertar um item da lista de erros o tira da lista e conta como "errado antes"', () => {
    const slice: TrackSlice = {
      journey: { ...start(), misses: ['vocab:学校|jm', 'srs:あ'] },
      days: [],
      vocab: {},
      mastered: {},
      lessons: {},
      myPhrases: {},
    };
    const journey = trackAnswer(slice, [], NOW.getTime(), { ok: true, area: 'vocab', ref: 'vocab:学校|jm' });
    expect(journey.misses).toEqual(['srs:あ']);
    expect(journey.today.counts.rescued).toBe(1);
    // um acerto comum, sem erro anterior, não conta
    const plain = trackAnswer({ ...slice, journey }, [], NOW.getTime(), { ok: true, area: 'vocab', ref: 'vocab:casa|jm' });
    expect(plain.today.counts.rescued).toBe(1);
  });
});
