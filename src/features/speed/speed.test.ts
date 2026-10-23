import { buildSpeedRound, speedPool, summarize, SPEED_ROUND } from './speed';

describe('treino de velocidade', () => {
  it('sem kana conhecido usa todos os básicos; a rodada tem 20 perguntas com 4 alternativas', () => {
    const pool = speedPool([]);
    expect(pool.length).toBeGreaterThan(80);
    const round = buildSpeedRound(pool);
    expect(round).toHaveLength(SPEED_ROUND);
    for (const q of round) {
      expect(q.options).toHaveLength(4);
      expect(q.options).toContain(q.item);
    }
  });

  it('com kana conhecido de sobra usa só eles', () => {
    const known = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け'];
    expect(speedPool(known).map((i) => i.char).sort()).toEqual([...known].sort());
  });

  it('a média conta só os acertos e o recorde exige mais de 80% e tempo menor', () => {
    const fast = Array.from({ length: 20 }, () => ({ ms: 800, ok: true }));
    expect(summarize(fast, undefined)).toMatchObject({ averageMs: 800, record: true });
    expect(summarize(fast, 700).record).toBe(false);
    expect(summarize(fast, 900).record).toBe(true);
    const sloppy = fast.map((t, i) => ({ ...t, ok: i > 8 }));
    expect(summarize(sloppy, undefined).record).toBe(false);
  });
});
