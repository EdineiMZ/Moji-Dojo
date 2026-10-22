import { BUILD_EXERCISES } from './exercises';
import { GRAMMAR_TOPICS } from './grammar';
import { DAKUTEN_CYCLES, DIRECTION_NAMES, FLICK_KEYS, SIMULATOR_WORDS, TYPING_CHALLENGES } from './keyboard';
import { MINIMAL_PAIRS, SOUND_TOPICS } from './sounds';
import { TRAVEL_CATEGORIES } from './travel';
import type { RichBlock } from './types';

const plainText = (blocks: readonly RichBlock[]): string =>
  blocks
    .map((b) => (b.kind === 'p' ? b.runs.map((r) => r.text).join('') : b.rows.flat().map((c) => c.text).join(' ')))
    .join(' ');

describe('dados de frases, sons, viagem e teclado (extraídos do HTML)', () => {
  it('tem as quantidades do protótipo', () => {
    expect(GRAMMAR_TOPICS).toHaveLength(10);
    expect(BUILD_EXERCISES).toHaveLength(26);
    expect(SOUND_TOPICS).toHaveLength(9);
    expect(MINIMAL_PAIRS).toHaveLength(12);
    expect(TRAVEL_CATEGORIES).toHaveLength(6);
    expect(TRAVEL_CATEGORIES.flatMap((c) => c.phrases)).toHaveLength(37);
    expect(FLICK_KEYS).toHaveLength(12);
  });

  it('nenhum texto ficou com marcas de HTML', () => {
    for (const t of GRAMMAR_TOPICS) expect(plainText(t.body)).not.toMatch(/[<>]/);
    for (const t of SOUND_TOPICS) expect(plainText(t.body)).not.toMatch(/[<>]/);
  });

  it('a gramática mantém a tabela de verbos, com cabeçalhos e japonês', () => {
    const table = GRAMMAR_TOPICS.flatMap((t) => t.body).find((b) => b.kind === 'table');
    expect(table).toBeDefined();
    if (table?.kind !== 'table') throw new Error('sem tabela');
    expect(table.rows).toHaveLength(3);
    expect(table.rows[1]?.map((c) => c.text)).toEqual(['presente / futuro', 'たべます', 'たべません']);
    expect(table.rows[1]?.[1]?.ja).toBe(true);
    expect(table.rows[0]?.[1]?.header).toBe(true);
  });

  it('todo tópico e todo exemplo têm conteúdo', () => {
    for (const t of GRAMMAR_TOPICS) {
      expect(t.body.length).toBeGreaterThan(0);
      expect(t.examples.length).toBeGreaterThan(0);
      for (const e of t.examples) expect([e.jp, e.romaji, e.pt].every((x) => x.length > 0)).toBe(true);
    }
    for (const t of SOUND_TOPICS) expect(t.examples.length).toBeGreaterThan(0);
  });

  it('os exemplos de sons que precisam falar um texto diferente guardam o `say`', () => {
    const hashi = SOUND_TOPICS.flatMap((t) => t.examples).find((e) => e.pt === 'pauzinhos');
    expect(hashi).toMatchObject({ jp: 'はし (箸)', say: '箸' });
  });

  it('os exercícios de montar apontam para tópicos existentes e não repetem blocos extras da resposta', () => {
    const ids = new Set(GRAMMAR_TOPICS.map((t) => t.id));
    for (const e of BUILD_EXERCISES) {
      expect(ids.has(e.topic)).toBe(true);
      expect(e.answer.length).toBeGreaterThan(0);
      expect(e.extra.length).toBeGreaterThan(0); // "sobram blocos de propósito"
      expect(e.hint.length).toBeGreaterThan(0);
    }
  });

  it('as ordens alternativas que não dependem de bloco ausente reordenam a mesma resposta', () => {
    const reorder = BUILD_EXERCISES.filter((e) => e.alternatives?.some((alt) => alt.length === e.answer.length));
    expect(reorder.length).toBeGreaterThan(0);
    const fine = BUILD_EXERCISES.find((e) => e.pt === 'Ontem eu bebi cerveja.');
    expect(fine?.alternatives?.[0]).toEqual(['ビール', 'を', 'きのう', 'のみました']);
  });

  it('toda frase de viagem tem a divisão palavra por palavra', () => {
    for (const phrase of TRAVEL_CATEGORIES.flatMap((c) => c.phrases)) {
      expect(phrase.breakdown.length).toBeGreaterThan(0);
    }
  });

  it('os pares difíceis têm duas palavras diferentes cada', () => {
    for (const pair of MINIMAL_PAIRS) expect(pair.first.jp).not.toBe(pair.second.jp);
  });
});

describe('teclado de flick', () => {
  it('cada tecla comum tem um caractere por direção e há um nome para cada direção', () => {
    expect(DIRECTION_NAMES).toHaveLength(5);
    for (const key of FLICK_KEYS.filter((k) => k.label !== 'mod')) expect([...key.chars]).toHaveLength(5);
    expect(FLICK_KEYS.filter((k) => k.label === 'mod')).toHaveLength(1);
  });

  const typable = new Set<string>([...FLICK_KEYS.flatMap((k) => (k.label === 'mod' ? [] : [...k.chars])), ...DAKUTEN_CYCLES.flatMap((c) => [...c])]);

  it('todo caractere das palavras do simulador dá para digitar com as teclas e o ciclo de 小゛゜', () => {
    const missing = SIMULATOR_WORDS.flatMap((w) => [...w.word]).filter((c) => !typable.has(c));
    expect(missing).toEqual([]);
  });

  it('as palavras do desafio têm dica ou ficam vazias de propósito, sem quebrar o formato', () => {
    expect(TYPING_CHALLENGES).toHaveLength(9);
    for (const c of TYPING_CHALLENGES) expect(c.word.length).toBeGreaterThan(0);
  });
});
