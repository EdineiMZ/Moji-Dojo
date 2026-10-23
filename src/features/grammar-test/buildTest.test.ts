import { ALL_GRAMMAR } from '@/content/grammar';
import { buildMeaningQuestion, buildTopicTest, passedTest, TEST_QUESTIONS } from './buildTest';

describe('mini-teste de tópico', () => {
  it('todo tópico gera de 3 a 5 perguntas, cada uma com 4 alternativas e uma só certa', () => {
    for (const topic of ALL_GRAMMAR) {
      for (let i = 0; i < 20; i++) {
        const questions = buildTopicTest(topic.id);
        expect(questions.length).toBeGreaterThanOrEqual(3);
        expect(questions.length).toBeLessThanOrEqual(TEST_QUESTIONS);
        for (const q of questions) {
          expect(q.options.length).toBeGreaterThanOrEqual(2);
          expect(new Set(q.options.map((o) => o.char)).size).toBe(q.options.length);
          expect(q.options.filter((o) => o.char === q.item.char)).toHaveLength(1);
        }
        expect(new Set(questions.map((q) => q.item.label)).size).toBe(questions.length);
      }
    }
  });

  it('a pergunta de significado mostra a frase e oferece traduções', () => {
    const topic = ALL_GRAMMAR[10]!;
    const example = topic.examples[0]!;
    const q = buildMeaningQuestion(topic, example);
    expect(q.options).toHaveLength(4);
    expect(q.item.char).toBe(example.jp);
    expect(q.options.find((o) => o.char === example.jp)?.label).toBe(example.pt);
    expect(new Set(q.options.map((o) => o.label)).size).toBe(4);
  });

  it('tópico inexistente não gera nada', () => {
    expect(buildTopicTest('g99')).toEqual([]);
  });

  it('passa com 80% de acertos de primeira, no mínimo', () => {
    expect(passedTest(4, 5)).toBe(true);
    expect(passedTest(3, 5)).toBe(false);
    expect(passedTest(5, 5)).toBe(true);
    expect(passedTest(3, 4)).toBe(false);
    expect(passedTest(0, 0)).toBe(false);
  });
});

describe('progresso do mini-teste', () => {
  const { createProgressStore } = jest.requireActual('@/store/progressStore') as typeof import('@/store/progressStore');
  const memoryStorage = () => {
    const data = new Map<string, string>();
    return {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
      removeItem: (k: string) => void data.delete(k),
    };
  };
  const NOW = 1_800_000_000_000;

  it('dominar um tópico guarda o momento da primeira aprovação e marca o dia', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().masterTopic('g4', NOW);
    store.getState().masterTopic('g4', NOW + 5_000);
    expect(store.getState().mastered).toEqual({ g4: NOW });
    expect(store.getState().days).toHaveLength(1);
  });

  it('o reset zera os tópicos dominados', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().masterTopic('g4', NOW);
    store.getState().resetProgress();
    expect(store.getState().mastered).toEqual({});
  });
});
