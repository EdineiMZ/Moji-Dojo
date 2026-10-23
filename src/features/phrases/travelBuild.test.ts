import { ALL_TRAVEL_PHRASES } from '@/content/travel';
import { exercisesForTopic } from './build';
import { ALL_TRAVEL_TOPIC, TRAVEL_EXERCISES, travelTopics } from './travelBuild';

describe('Montar com frases de viagem', () => {
  it('há muitos exercícios, de 3 a 8 blocos, e os blocos fecham com a frase', () => {
    const all = TRAVEL_EXERCISES();
    expect(all.length).toBeGreaterThan(120);
    for (const e of all) {
      expect(e.answer.length).toBeGreaterThanOrEqual(3);
      expect(e.answer.length).toBeLessThanOrEqual(8);
      const phrase = ALL_TRAVEL_PHRASES.find((p) => p.pt === e.pt && p.romaji === e.romaji);
      expect(phrase?.jp.replace(/ /g, '')).toBe(e.answer.join(''));
      expect(e.extra.length).toBeLessThanOrEqual(2);
      for (const extra of e.extra) expect(e.answer).not.toContain(extra);
    }
  });

  it('cada categoria vira um tópico e "todas" junta tudo', () => {
    const topics = travelTopics();
    expect(topics.length).toBeGreaterThanOrEqual(10);
    expect(exercisesForTopic(ALL_TRAVEL_TOPIC)).toHaveLength(TRAVEL_EXERCISES().length);
    const first = topics[0]!;
    expect(exercisesForTopic(first.value).every((e) => e.topic === first.value)).toBe(true);
    expect(exercisesForTopic(first.value).length).toBeGreaterThan(0);
  });
});
