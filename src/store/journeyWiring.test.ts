import { streakDays } from '@/features/streak/days';
import { createProgressStore } from './progressStore';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

const at = (day: number, hour = 12) => new Date(2026, 9, day, hour).getTime();

describe('a jornada ligada ao progresso', () => {
  it('abrir o app marca o dia e deixa o baú do dia pronto, que se abre uma vez só', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().openApp(at(21));
    expect(store.getState().days).toEqual(['2026-10-21']);
    expect(store.getState().journey.petals).toBe(0);
    expect(store.getState().journey.today.chest).toBe('ready');

    const loot = store.getState().openDailyChest(at(21), () => 0);
    expect(loot).not.toBeNull();
    const petals = store.getState().journey.petals;
    expect(petals).toBe(loot?.petals);
    expect(store.getState().journey.today.chest).toBe('opened');

    store.getState().openApp(at(21, 18));
    expect(store.getState().journey.petals).toBe(petals);
    expect(store.getState().openDailyChest(at(21, 18), () => 0)).toBeNull();
  });

  it('concluir uma lição com a nota paga pétalas e conta a conquista; sem nota só conta o dia', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().completeLesson('hira:L0', ['あ', 'い', 'う', 'え', 'お'], false, at(21), { first: 10, total: 10 });
    const j = store.getState().journey;
    expect(j.counters.lessons).toBe(1);
    expect(j.achievements['perfect-1']).toBeDefined();
    expect(j.petals).toBeGreaterThanOrEqual(20);

    const other = createProgressStore(memoryStorage());
    other.getState().completeLesson('hira:L0', ['あ'], false, at(21));
    expect(other.getState().journey.counters.lessons).toBeUndefined();
    expect(other.getState().lessons['hira:L0']).toBe(true);
  });

  it('errar guarda o item na lista de erros recentes; acertar só soma experiência', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().recordAnswer('あ', false, at(21));
    store.getState().recordAnswer('い', true, at(21));
    const j = store.getState().journey;
    expect(j.misses).toEqual(['srs:あ']);
    expect(j.xp).toBe(3);
    expect(j.counters.correct).toBe(1);
  });

  it('respostas de vocabulário contam para o desafio da semana (grupo da palavra)', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().learnWords(['学校'], at(21));
    store.getState().recordVocabAnswer('学校|jm', true, true, at(21));
    expect(store.getState().journey.today.counts.vocab).toBe(1);
    expect(store.getState().journey.misses).toEqual([]);
    store.getState().recordVocabAnswer('学校|jm', false, true, at(21));
    expect(store.getState().journey.misses).toEqual(['vocab:学校|jm']);
  });

  it('drills contam por área: ditado vale como ouvido', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().recordDrill(true, 'dictation', at(21));
    store.getState().recordDrill(true, undefined, at(21));
    const j = store.getState().journey;
    expect(j.today.counts.listen).toBe(1);
    expect(j.today.counts.answers).toBe(2);
    expect(j.counters.dictations).toBe(1);
  });

  it('quem perde dois dias de uma sequência de quatro recebe a oferta ao abrir, e salvar preenche os dias', () => {
    const store = createProgressStore(memoryStorage());
    for (const d of [15, 16, 17, 18]) store.getState().openApp(at(d));
    expect(store.getState().journey.rescue).toBeNull();

    store.getState().openApp(at(21));
    const offer = store.getState().journey.rescue;
    expect(offer).toEqual({ day: '2026-10-21', missed: ['2026-10-19', '2026-10-20'], broken: 4 });
    expect(streakDays(store.getState().days, new Date(at(21)))).toBe(1);

    store.getState().finishRescue(20, 25, at(21));
    const j = store.getState().journey;
    expect(j.rescue).toBeNull();
    expect(j.counters.rescues).toBe(1);
    expect(j.achievements['rescue-1']).toBeDefined();
    expect(streakDays(store.getState().days, new Date(at(21)))).toBe(7);
  });

  it('reprovar no resgate não preenche os dias e libera para tentar de novo na próxima vez', () => {
    const store = createProgressStore(memoryStorage());
    for (const d of [15, 16, 17, 18]) store.getState().openApp(at(d));
    store.getState().openApp(at(21));
    store.getState().finishRescue(10, 25, at(21));
    expect(streakDays(store.getState().days, new Date(at(21)))).toBe(1);
    expect(store.getState().journey.lastRescueAt).toBeNull();
    expect(store.getState().journey.rescue).toBeNull();
  });

  it('recusar a oferta fecha ela', () => {
    const store = createProgressStore(memoryStorage());
    for (const d of [15, 16, 17, 18]) store.getState().openApp(at(d));
    store.getState().openApp(at(21));
    store.getState().declineRescue();
    expect(store.getState().journey.rescue).toBeNull();
  });

  it('a oferta do dia anterior que ficou sem resposta some ao abrir no dia seguinte', () => {
    const store = createProgressStore(memoryStorage());
    for (const d of [15, 16, 17, 18]) store.getState().openApp(at(d));
    store.getState().openApp(at(21));
    expect(store.getState().journey.rescue).not.toBeNull();
    store.getState().openApp(at(22));
    expect(store.getState().journey.rescue).toBeNull();
  });

  it('o baú da semana abre com 4 dias estudados', () => {
    const store = createProgressStore(memoryStorage());
    for (const d of [19, 20, 21]) store.getState().openApp(at(d));
    store.getState().claimWeekChest(at(21));
    expect(store.getState().journey.weeksWon).toBe(0);
    store.getState().openApp(at(22));
    store.getState().claimWeekChest(at(22));
    expect(store.getState().journey.weeksWon).toBe(1);
    expect(store.getState().journey.owned).toContain('laco-semana');
  });

  it('recordSession paga a revisão e marca o dia', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().recordSession(20, 20, at(21));
    expect(store.getState().days).toEqual(['2026-10-21']);
    expect(store.getState().journey.counters.sessions).toBe(1);
  });

  it('respostas de revisão e verbos novos contam para os limites do dia; lição e drill, não', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().learnWords(['学校'], at(21));
    store.getState().learnVerbs(['食べる', '飲む'], at(21));
    store.getState().recordVocabAnswer('学校|jm', true, true, at(21));
    store.getState().recordReviewAnswer('あ', true, true, false, at(21));
    store.getState().recordAnswer('い', true, at(21));
    store.getState().recordDrill(true, 'drill', at(21));
    const counts = store.getState().journey.today.counts;
    expect(counts.newWords).toBe(3);
    expect(counts.reviews).toBe(2);
    expect(counts.answers).toBe(4);
  });
});
