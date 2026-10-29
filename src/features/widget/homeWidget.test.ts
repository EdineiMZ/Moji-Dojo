import { widgetPayload, HORIZON_MS } from './homeWidget';

const NOW = new Date(2026, 9, 28, 10, 0).getTime();
const H = 3_600_000;
const entry = (due: number) => ({ b: 2, due });

describe('conteúdo do widget', () => {
  it('conta as vencidas de kana, palavras, verbos e partículas, e a sequência de dias', () => {
    const payload = widgetPayload(
      {
        srs: { あ: entry(NOW - H), い: entry(NOW + 5 * H), 日: entry(NOW - 2 * H) },
        vocab: {},
        conj: {},
        particles: { を: entry(NOW - 1), に: entry(NOW + 2 * H) },
        days: ['2026-10-27', '2026-10-28'],
      },
      NOW,
    );
    // あ e 日 (kana e kanji conhecidos) + a partícula を
    expect(payload.dueNow).toBe(3);
    expect(payload.streak).toBe(2);
  });

  it('diz ao widget quando vencem as próximas, só dentro do horizonte e em ordem', () => {
    const payload = widgetPayload(
      {
        srs: { あ: entry(NOW + 5 * H), い: entry(NOW + 1 * H), う: entry(NOW + HORIZON_MS + H), え: entry(NOW - H) },
        vocab: {},
        conj: {},
        particles: { を: entry(NOW + 3 * H) },
        days: [],
      },
      NOW,
    );
    expect(payload.upcoming).toEqual([NOW + 1 * H, NOW + 3 * H, NOW + 5 * H]);
    expect(payload.dueNow).toBe(1);
  });

  it('ignora o que não existe mais no app e não passa de 500 horários', () => {
    const many = Object.fromEntries(Array.from({ length: 700 }, (_, i) => [`p${i}`, entry(NOW + (i + 1) * 1000)]));
    const payload = widgetPayload({ srs: { 'ZZ': entry(NOW - H) }, vocab: {}, conj: {}, particles: many, days: [] }, NOW);
    expect(payload.dueNow).toBe(0);
    expect(payload.upcoming).toHaveLength(500);
  });

  it('o widget (no Kotlin) soma o que venceu desde que o app guardou a lista: a mesma conta, em ms', () => {
    const payload = widgetPayload({ srs: {}, vocab: {}, conj: {}, particles: { a: entry(NOW + H), b: entry(NOW + 3 * H) }, days: [] }, NOW);
    const later = NOW + 2 * H;
    const arrived = payload.upcoming.filter((at) => at <= later).length;
    expect(payload.dueNow + arrived).toBe(1);
  });
});
