import { BUILD_EXERCISES } from '@/data/exercises';
import { ALL_EXERCISES, ALL_GRAMMAR } from '@/content/grammar';
import type { BuildExercise } from '@/data/types';
import {
  addToken,
  ALL_TOPICS,
  checkRound,
  clearTokens,
  createRound,
  currentExercise,
  exercisesForTopic,
  isCorrect,
  nextExercise,
  removeToken,
  type BuildRound,
  type Token,
} from './build';

const rng = () => 0.31;

const find = (pt: string): BuildExercise => {
  const e = BUILD_EXERCISES.find((x) => x.pt === pt);
  if (!e) throw new Error(`exercício não encontrado: ${pt}`);
  return e;
};

/** Toca nos blocos de `texts`, na ordem, escolhendo no pool o primeiro ainda livre de cada texto. */
function build(round: BuildRound, texts: readonly string[]): BuildRound {
  let r = round;
  for (const text of texts) {
    const token = r.pool.find((t) => t.text === text && !r.chosen.some((c) => c.id === t.id));
    if (!token) throw new Error(`bloco indisponível: ${text}`);
    r = addToken(r, token.id);
  }
  return r;
}

const tokens = (...texts: string[]): Token[] => texts.map((text, id) => ({ id, text }));

describe('exercisesForTopic', () => {
  it('todos os tópicos ou um só', () => {
    expect(exercisesForTopic(ALL_TOPICS)).toHaveLength(ALL_EXERCISES.length);
    expect(ALL_EXERCISES.length).toBeGreaterThan(26);
    const g4 = exercisesForTopic('g4');
    expect(g4.length).toBeGreaterThan(0);
    expect(g4.every((e) => e.topic === 'g4')).toBe(true);
  });

  it('todo tópico com exercício existe na gramática', () => {
    const ids = new Set(ALL_GRAMMAR.map((t) => t.id));
    expect(ALL_EXERCISES.every((e) => ids.has(e.topic))).toBe(true);
  });
});

describe('isCorrect', () => {
  const sushi = find('Quero comer sushi.');
  const beer = find('Ontem eu bebi cerveja.');

  it('a resposta na ordem certa', () => {
    expect(isCorrect(sushi, tokens('すし', 'を', 'たべたいです'))).toBe(true);
  });

  it('uma ordem alternativa aceita (ontem pode vir depois da cerveja)', () => {
    expect(isCorrect(beer, tokens('きのう', 'ビール', 'を', 'のみました'))).toBe(true);
    expect(isCorrect(beer, tokens('ビール', 'を', 'きのう', 'のみました'))).toBe(true);
  });

  it('ordem errada, bloco a mais ou a menos e um bloco de sobra reprovam', () => {
    expect(isCorrect(sushi, tokens('を', 'すし', 'たべたいです'))).toBe(false);
    expect(isCorrect(sushi, tokens('すし', 'を'))).toBe(false);
    expect(isCorrect(sushi, tokens('すし', 'を', 'たべたいです', 'に'))).toBe(false);
    expect(isCorrect(sushi, tokens('すし', 'に', 'たべたいです'))).toBe(false);
  });

  it('o que importa é o texto: dois "に" são intercambiáveis', () => {
    const hotel = find('Vou ao hotel às 3 horas.');
    expect(isCorrect(hotel, tokens('さんじ', 'に', 'ホテル', 'に', 'いきます'))).toBe(true);
  });
});

describe('rodada', () => {
  const exercises = [find('Quero comer sushi.'), find('Isto, por favor.')];

  it('começa com a primeira frase, sem blocos escolhidos, e o pool tem a resposta mais as sobras', () => {
    const round = createRound(exercises, rng);
    const e = currentExercise(round)!;
    expect(round.chosen).toEqual([]);
    expect(round.checked).toBeNull();
    expect(round.pool.map((t) => t.text).sort()).toEqual([...e.answer, ...e.extra].sort());
  });

  it('rodada vazia já nasce terminada', () => {
    expect(createRound([], rng).finished).toBe(true);
  });

  it('um bloco só entra uma vez; tocar na frase o devolve ao pool', () => {
    let round = createRound(exercises, rng);
    const first = round.pool[0]!;
    round = addToken(round, first.id);
    round = addToken(round, first.id); // já usado: ignora
    expect(round.chosen).toHaveLength(1);
    round = removeToken(round, 0);
    expect(round.chosen).toHaveLength(0);
    expect(removeToken(round, 5)).toBe(round);
  });

  it('limpar esvazia a frase', () => {
    let round = createRound(exercises, rng);
    round = addToken(round, round.pool[0]!.id);
    round = addToken(round, round.pool[1]!.id);
    expect(clearTokens(round).chosen).toEqual([]);
  });

  it('conferir sem nenhum bloco não faz nada (a tela avisa)', () => {
    const round = createRound(exercises, rng);
    expect(checkRound(round)).toBe(round);
  });

  it('acerto: conta como certa e trava a frase', () => {
    let round = createRound(exercises, rng);
    const e = currentExercise(round)!;
    round = checkRound(build(round, e.answer));
    expect(round).toMatchObject({ checked: 'ok', correct: 1, attempted: 1 });
    // depois de conferir, não dá mais para mexer nos blocos
    const locked = addToken(round, round.pool[0]!.id);
    expect(locked).toBe(round);
    expect(removeToken(round, 0)).toBe(round);
    expect(clearTokens(round)).toBe(round);
    expect(checkRound(round)).toBe(round); // e não conta duas vezes
  });

  it('erro: conta como conferida, mas não como certa', () => {
    let round = createRound(exercises, rng);
    const e = currentExercise(round)!;
    round = checkRound(build(round, [...e.answer].reverse()));
    expect(round).toMatchObject({ checked: 'bad', correct: 0, attempted: 1 });
  });

  it('só avança depois de conferir; na última frase termina', () => {
    let round = createRound(exercises, rng);
    expect(nextExercise(round, rng)).toBe(round);

    round = checkRound(build(round, currentExercise(round)!.answer));
    round = nextExercise(round, rng);
    expect(round).toMatchObject({ index: 1, chosen: [], checked: null, finished: false });

    round = checkRound(build(round, currentExercise(round)!.answer));
    round = nextExercise(round, rng);
    expect(round.finished).toBe(true);
    expect(round).toMatchObject({ correct: 2, attempted: 2 });
  });

  it('o pool da frase seguinte é novo (e embaralhado de novo)', () => {
    let round = createRound(exercises, rng);
    round = nextExercise(checkRound(build(round, currentExercise(round)!.answer)), rng);
    const e = currentExercise(round)!;
    expect(round.pool.map((t) => t.text).sort()).toEqual([...e.answer, ...e.extra].sort());
  });
});

describe('os 26 exercícios iniciais são montáveis', () => {
  it('a resposta e as ordens alternativas que só usam blocos oferecidos são aceitas', () => {
    for (const e of BUILD_EXERCISES) {
      let round = createRound([e], rng);
      round = checkRound(build(round, e.answer));
      expect({ pt: e.pt, resultado: round.checked }).toEqual({ pt: e.pt, resultado: 'ok' });

      const offered = [...e.answer, ...e.extra];
      for (const alt of e.alternatives ?? []) {
        if (alt.every((b) => offered.includes(b))) {
          const r = checkRound(build(createRound([e], rng), alt));
          expect({ pt: e.pt, alt: alt.join(' '), resultado: r.checked }).toEqual({ pt: e.pt, alt: alt.join(' '), resultado: 'ok' });
        }
      }
    }
  });
});
