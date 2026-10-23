import { createProgressStore } from '@/store/progressStore';
import { buildParticleReview, dueParticles, particleCounts, PARTICLE_CARDS } from './particles';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};
const NOW = 1_800_000_000_000;
const DAY = 86_400_000;

describe('revisão de partículas', () => {
  it('as nunca revisadas estão sempre vencidas; as agendadas só quando vencem', () => {
    expect(dueParticles({}, NOW).sort()).toEqual([...PARTICLE_CARDS].sort());
    const state = { は: { b: 3, due: NOW + DAY }, を: { b: 2, due: NOW - 1 } };
    const due = dueParticles(state, NOW);
    expect(due).not.toContain('は');
    expect(due[0]).toBe('を');
    expect(particleCounts(state, NOW)).toMatchObject({ started: 2, total: PARTICLE_CARDS.length, due: PARTICLE_CARDS.length - 1 });
  });

  it('cada pergunta tem a partícula como resposta certa e a frase em branco', () => {
    const questions = buildParticleReview(['は', 'を', 'に', 'で', 'の', 'も', 'と', 'が', 'から', 'まで', 'より']);
    expect(questions.length).toBeGreaterThan(6);
    for (const q of questions) {
      expect(PARTICLE_CARDS).toContain(q.item.char);
      expect(q.options.map((o) => o.char)).toContain(q.item.char);
      expect(q.item.label).toContain('＿＿');
    }
  });

  it('responder reagenda a partícula, marca o dia e conta no histórico', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().recordParticleAnswer('を', true, true, NOW);
    expect(store.getState().particles['を']).toMatchObject({ b: 2 });
    expect(store.getState().days).toHaveLength(1);
    store.getState().recordParticleAnswer('を', false, true, NOW);
    expect(store.getState().particles['を']).toEqual({ b: 1, due: NOW, l: 1 });
    store.getState().recordParticleAnswer('xyz', true, true, NOW);
    expect(Object.keys(store.getState().particles)).toEqual(['を']);
    store.getState().resetProgress();
    expect(store.getState().particles).toEqual({});
  });
});
