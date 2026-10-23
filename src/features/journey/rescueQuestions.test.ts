import { VOCAB } from '@/content';
import { ALL_ITEMS } from '@/features/catalog';
import { VERBS } from '@/features/conjugation/verbs';
import { cardKeysFor as verbKeys } from '@/features/conjugation/cards';
import { cardKeysFor as wordKeys } from '@/features/vocab/cards';
import type { SrsState } from '@/features/review/srs';
import { buildRescueQuestions, MIN_RESCUE_QUESTIONS } from './rescueQuestions';

const NOW = 1_800_000_000_000;
const due = (keys: string[]): SrsState => Object.fromEntries(keys.map((k) => [k, { b: 1, due: NOW - 1000 }]));

const kana = ALL_ITEMS.filter((i) => i.script === 'hira').slice(0, 20).map((i) => i.char);
const words = VOCAB.slice(0, 6);
const verb = VERBS[0];

describe('revisão de resgate', () => {
  it('começa pelos erros recentes, de todas as áreas, e marca de onde cada pergunta veio', () => {
    const misses = [
      `srs:${kana[0]}`,
      `vocab:${wordKeys(words[0]!)[0]}`,
      `conj:${verbKeys(verb!)[0]}`,
      'particle:を',
      'srs:caractere-que-nao-existe',
      'vocab:palavra que nao existe|jm',
    ];
    const { questions, kind } = buildRescueQuestions({ misses, srs: {}, vocab: {}, conj: {}, now: NOW });
    expect(questions).toHaveLength(4);
    expect([...kind.values()].sort()).toEqual(['conj', 'kana', 'particle', 'vocab']);
    for (const q of questions) expect(kind.get(q)).toBeDefined();
  });

  it('completa com cartões vencidos até 25, sem repetir o mesmo cartão', () => {
    const vocab = due(words.flatMap(wordKeys));
    const srs = due(kana);
    const { questions } = buildRescueQuestions({ misses: [`srs:${kana[0]}`], srs, vocab, conj: due(verbKeys(verb!)), now: NOW });
    expect(questions.length).toBe(25);
    const ids = questions.map((q) => `${q.direction}:${q.item.char}:${q.item.script === 'pair' ? (q.item.key ?? '') : ''}`);
    expect(new Set(ids).size).toBeGreaterThan(15);
  });

  it('sem erros nem cartões vencidos não há revisão para montar', () => {
    const { questions } = buildRescueQuestions({ misses: [], srs: {}, vocab: {}, conj: {}, now: NOW });
    expect(questions).toHaveLength(0);
    expect(questions.length).toBeLessThan(MIN_RESCUE_QUESTIONS);
  });

  it('respeita o limite pedido e dá para pedir menos', () => {
    const srs = due(kana);
    expect(buildRescueQuestions({ misses: [], srs, vocab: {}, conj: {}, now: NOW }, Math.random, 8).questions).toHaveLength(8);
  });

  it('cartões que ainda não vencem não entram no preenchimento', () => {
    const later: SrsState = Object.fromEntries(kana.map((k) => [k, { b: 3, due: NOW + 86_400_000 }]));
    expect(buildRescueQuestions({ misses: [], srs: later, vocab: {}, conj: {}, now: NOW }).questions).toHaveLength(0);
  });
});
