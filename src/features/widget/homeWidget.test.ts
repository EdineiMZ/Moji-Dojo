import { widgetPayload, HORIZON_MS } from './homeWidget';

const NOW = new Date(2026, 9, 28, 10, 0).getTime();
const H = 3_600_000;
const entry = (due: number) => ({ b: 2, due });

// Quarta, 28/10/2026 às 10:00. A contagem de vencidas vira na próxima virada do dia (4h): quinta, 29/10 às 4h.
const NEXT_ROLLOVER = new Date(2026, 9, 29, 4, 0).getTime();

describe('conteúdo do widget', () => {
  it('conta as vencidas de kana, palavras, verbos e partículas, e a sequência de dias', () => {
    const payload = widgetPayload(
      {
        srs: { あ: entry(NOW - H), い: entry(NOW + 30 * H), 日: entry(NOW - 2 * H) },
        vocab: {},
        conj: {},
        particles: { を: entry(NOW - 1), に: entry(NOW + 30 * H) },
        days: ['2026-10-27', '2026-10-28'],
      },
      NOW,
    );
    // あ e 日 (kana e kanji conhecidos) + a partícula を
    expect(payload.dueNow).toBe(3);
    expect(payload.streak).toBe(2);
  });

  it('o que vence ainda hoje (antes da virada das 4h) já conta como vencido', () => {
    const payload = widgetPayload({ srs: { あ: entry(NOW + 5 * H) }, vocab: {}, conj: {}, particles: { を: entry(NOW + 17 * H) }, days: [] }, NOW);
    expect(payload.dueNow).toBe(2);
    expect(payload.upcoming).toEqual([]);
  });

  it('diz ao widget quando a contagem sobe: na virada do dia em que cada um vence, só dentro do horizonte', () => {
    const payload = widgetPayload(
      {
        srs: { あ: entry(NOW + 30 * H), い: entry(NOW + 20 * H), う: entry(NOW + HORIZON_MS + 12 * H), え: entry(NOW - H) },
        vocab: {},
        conj: {},
        particles: { を: entry(NOW + 26 * H) },
        days: [],
      },
      NOW,
    );
    expect(payload.upcoming).toEqual([NEXT_ROLLOVER, NEXT_ROLLOVER, NEXT_ROLLOVER]);
    expect(payload.dueNow).toBe(1);
  });

  it('ignora o que não existe mais no app e não passa de 500 horários', () => {
    const many = Object.fromEntries(Array.from({ length: 700 }, (_, i) => [`p${i}`, entry(NOW + 20 * H + i * 1000)]));
    const payload = widgetPayload({ srs: { 'ZZ': entry(NOW - H) }, vocab: {}, conj: {}, particles: many, days: [] }, NOW);
    expect(payload.dueNow).toBe(0);
    expect(payload.upcoming).toHaveLength(500);
  });

  it('o widget (no Kotlin) soma o que venceu desde que o app guardou a lista: dá a mesma conta do app, a qualquer hora', () => {
    const progress = {
      srs: {},
      vocab: {},
      conj: {},
      particles: { a: entry(NOW + H), b: entry(NOW + 20 * H), c: entry(NOW + 26 * H), d: entry(NOW + 40 * H) },
      days: [],
    };
    const payload = widgetPayload(progress, NOW);
    for (const later of [NOW + 2 * H, NOW + 17 * H, NOW + 19 * H, NOW + 30 * H]) {
      const arrived = payload.upcoming.filter((at) => at <= later).length;
      expect(payload.dueNow + arrived).toBe(widgetPayload(progress, later).dueNow);
    }
  });
});
