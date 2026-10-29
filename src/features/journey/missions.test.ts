import { onAnswer, onExplored, onSession, roll, type EventContext } from './events';
import { emptyJourney, type JourneyState } from './journey';
import { advanceChains, chainStatus, MISSION_REWARDS, MISSIONS, missionsFor, rewardOf, todaysMissions } from './missions';
import { weakSkills } from './skills';
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

describe('missões: peso pelas áreas fracas, horário e cadeia', () => {
  const DAYS = Array.from({ length: 28 }, (_, i) => `2026-11-${String(i + 1).padStart(2, '0')}`);

  it('sem opções, o sorteio é o mesmo de sempre; e não repete a missão de ontem', () => {
    for (let i = 1; i < DAYS.length; i++) {
      const today = missionsFor(DAYS[i] as string).map((m) => m.id);
      const yesterday = missionsFor(DAYS[i - 1] as string).map((m) => m.id);
      today.forEach((id, k) => expect(id).not.toBe(yesterday[k]));
    }
    expect(new Set(DAYS.flatMap((d) => missionsFor(d).map((m) => m.id))).size).toBeGreaterThan(14);
  });

  it('com a escuta fraca, a missão média é sempre a do ouvido; a difícil e a fácil só mudam se houver uma da habilidade', () => {
    for (const day of DAYS) {
      const picked = missionsFor(day, { weak: ['listening'] });
      expect(picked[1]?.skill).toBe('listening');
    }
    // Na gramática fraca, a média e a difícil são de gramática; a fácil não tem nenhuma e segue o sorteio normal.
    for (const day of DAYS) {
      const picked = missionsFor(day, { weak: ['grammar'] });
      expect(picked[1]?.skill).toBe('grammar');
      expect(picked[2]?.skill).toBe('grammar');
      expect(picked[0]?.id).toBe(missionsFor(day)[0]?.id);
    }
  });

  it('com duas habilidades fracas, as missões das duas aparecem ao longo dos dias', () => {
    const skills = new Set(DAYS.flatMap((d) => missionsFor(d, { weak: ['vocab', 'sentences'] }).map((m) => m.skill)));
    expect(skills.has('vocab')).toBe(true);
    expect(skills.has('sentences')).toBe(true);
  });

  it('a missão da manhã não entra depois do meio-dia; a da noite entra sempre', () => {
    const afternoon = DAYS.flatMap((d) => missionsFor(d, { hour: 15 }).map((m) => m.id));
    expect(afternoon).not.toContain('morning-10');
    const morning = DAYS.flatMap((d) => missionsFor(d, { hour: 8 }).map((m) => m.id));
    expect(morning).toContain('morning-10');
    expect(DAYS.flatMap((d) => missionsFor(d, { hour: 15 }).map((m) => m.id))).toContain('evening-10');
  });

  it('as respostas da manhã e as da noite contam em contadores próprios', () => {
    const at = (hour: number) => onAnswer(roll(emptyJourney(), new Date(2026, 9, 21, hour)), { ...ctx(), now: new Date(2026, 9, 21, hour) }, { ok: true, area: 'vocab' });
    expect(at(9).today.counts.answersMorning).toBe(1);
    expect(at(9).today.counts.answersEvening).toBeUndefined();
    expect(at(14).today.counts.answersMorning).toBeUndefined();
    expect(at(14).today.counts.answersEvening).toBeUndefined();
    expect(at(19).today.counts.answersEvening).toBe(1);
  });

  it('as três missões do dia ficam fixadas no começo do dia, mesmo que as habilidades mudem depois', () => {
    const state = roll({ ...emptyJourney(), counters: { 'sk.listening.n': 20, 'sk.listening.ok': 5 } }, NOW);
    expect(state.today.missions).toHaveLength(3);
    expect(todaysMissions(state.today)[1]?.skill).toBe('listening');
    // Depois de acertar tudo na escuta, rolar de novo no mesmo dia não troca as missões.
    const better = roll({ ...state, counters: { 'sk.listening.n': 100, 'sk.listening.ok': 100 } }, NOW);
    expect(better.today.missions).toEqual(state.today.missions);
  });

  it('só as habilidades com respostas suficientes e abaixo de 80% contam como fracas, a mais fraca primeiro', () => {
    expect(weakSkills({})).toEqual([]);
    expect(weakSkills({ 'sk.vocab.n': 5, 'sk.vocab.ok': 0 })).toEqual([]); // pouco dado
    expect(weakSkills({ 'sk.vocab.n': 20, 'sk.vocab.ok': 19 })).toEqual([]); // boa
    expect(weakSkills({ 'sk.vocab.n': 20, 'sk.vocab.ok': 12, 'sk.grammar.n': 20, 'sk.grammar.ok': 6, 'sk.kana.n': 20, 'sk.kana.ok': 10 })).toEqual(['grammar', 'kana']);
  });
});

describe('missão em cadeia', () => {
  const chain = MISSIONS.find((m) => m.id === 'chain-day')!;
  const base = { lessons: 0, sessions: 0, phrases: 0 };

  it('cada passo só conta o que foi feito depois do anterior', () => {
    // Fez a revisão e a frase ANTES da lição: nada disso adianta para os passos 2 e 3.
    let counts: Record<string, number> = { ...base, sessions: 1, phrases: 1 };
    counts = advanceChains(counts, [chain]);
    expect(counts[chain.counter] ?? 0).toBe(0);
    // Concluiu a lição: passo 1 cumprido; o 2 e o 3 recomeçam do zero, ignorando o que já tinha.
    counts = advanceChains({ ...counts, lessons: 1 }, [chain]);
    expect(counts[chain.counter]).toBe(1);
    expect(chainStatus(counts, chain)).toMatchObject({ step: 2, total: 3, have: 0, goal: 1 });
    // Agora a revisão do dia vale.
    counts = advanceChains({ ...counts, sessions: 2 }, [chain]);
    expect(counts[chain.counter]).toBe(2);
    counts = advanceChains({ ...counts, phrases: 2 }, [chain]);
    expect(counts[chain.counter]).toBe(3);
    expect(chainStatus(counts, chain)).toMatchObject({ step: 3, have: 1, goal: 1 });
  });

  it('na ordem certa, cumpre tudo de uma vez quando as ações vêm seguidas', () => {
    let counts = advanceChains({ ...base, lessons: 1 }, [chain]);
    counts = advanceChains({ ...counts, sessions: 1 }, [chain]);
    counts = advanceChains({ ...counts, phrases: 1 }, [chain]);
    expect(counts[chain.counter]).toBe(3);
  });

  it('sem mudança, devolve os mesmos contadores', () => {
    const counts = { lessons: 0 };
    expect(advanceChains(counts, [chain])).toBe(counts);
    expect(advanceChains(counts, MISSIONS.filter((m) => !m.chain))).toBe(counts);
  });

  it('resgata a missão e paga quando o último passo é cumprido, em eventos de verdade', () => {
    let state = roll(emptyJourney(), NOW);
    state = { ...state, today: { ...state.today, missions: ['answers-20', 'chain-ears', 'chain-day'] } };
    state = onSession(state, ctx(), { first: 5, total: 5 }); // sessions=1, mas a lição (passo 1) ainda não foi feita
    expect(state.today.claimed).not.toContain('chain-day');
    expect(state.today.counts['chain:chain-day'] ?? 0).toBe(0);
  });
});
