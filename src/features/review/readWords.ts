import { VOCAB } from '@/content';
import { WORD_FREQUENCY } from '@/content/frequency';
import { wordLevelOfGroup } from '@/content/vocab';
import { LESSONS } from '@/data/lessons';
import { findItem } from '@/features/catalog';
import { kanaToRomaji } from '@/lib/romaji';
import { shuffle, type PairItem, type Question, type Rng } from '@/features/quiz/quiz';

/** Quantos kana a pessoa precisa conhecer para as palavras valerem a pena (cerca de três linhas). */
export const MIN_KNOWN_FOR_WORDS = 15;
/** Palavras por rodada. */
export const READ_WORDS = 10;

const SMALL_Y = new Set(['ゃ', 'ゅ', 'ょ', 'ャ', 'ュ', 'ョ']);
const LONG = 'ー';
const SOKUON = new Set(['っ', 'ッ']);

/** A palavra só usa kana que a pessoa já aprendeu? (ー vale; っ pede o marcador de `knownKana`; ゃゅょ pedem o par, como きゃ.) */
export function isReadable(text: string, known: ReadonlySet<string>): boolean {
  const chars = [...text];
  if (chars.length === 0) return false;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i] as string;
    const next = chars[i + 1];
    if (c === LONG) continue;
    if (SOKUON.has(c)) {
      // O っ/ッ pequeno não é um item de estudo: `knownKana` só o libera depois da lição de "Combinações 1".
      if (!known.has(c)) return false;
      continue;
    }
    if (next && SMALL_Y.has(next) && known.has(c + next)) {
      i++;
      continue;
    }
    if (!known.has(c)) return false;
  }
  return true;
}

/** Palavras curtas (2 a 5 sinais), só de kana, que dá para ler com o que a pessoa já sabe. */
export function readableWords(known: ReadonlySet<string>) {
  return VOCAB.filter((w) => {
    const n = [...w.jp].length;
    return w.kanji.length === 0 && w.jp === w.reading && n >= 2 && n <= 5 && isReadable(w.jp, known);
  });
}

const SCRIPTS = ['hira', 'kata'] as const;
/** A lição que apresenta os kana pequenos de cada escrita (ゃゅょ; o っ/ッ vem junto, pois nenhuma lição ensina só ele). */
const SMALL_KANA_LESSON = { hira: 'hira:L13', kata: 'kata:L13' } as const;
const SOKUON_OF = { hira: 'っ', kata: 'ッ' } as const;

/**
 * Os kana que a pessoa conhece para ler palavras: os do SRS (chaves que são caracteres do app), mas os kana pequenos
 * só contam depois de a lição da trilha que os ensina estar concluída:
 * - combinações (きゃ, しゅ...): só depois da lição daquele grupo;
 * - っ/ッ: só depois da lição "Combinações 1" da escrita.
 * `lessons` é o `lessons` do progresso (id da lição → true).
 */
export function knownKana(srsKeys: readonly string[], lessons: Readonly<Record<string, true>> = {}): Set<string> {
  const known = new Set(srsKeys.filter((c) => findItem(c) !== undefined));
  for (const script of SCRIPTS) {
    for (const lesson of LESSONS[script]) {
      if (lessons[lesson.id]) continue;
      for (const c of lesson.items) if ([...c].length > 1) known.delete(c);
    }
    if (lessons[SMALL_KANA_LESSON[script]]) known.add(SOKUON_OF[script]);
  }
  return known;
}

/** Nível JLPT (N5 primeiro) e depois uso: as palavras básicas e frequentes vêm antes das raras. */
const LEVEL_RANK = { N5: 0, N4: 1, N3: 2, N2: 3, N1: 4 } as const;
const wordFrequency = (id: string): number => WORD_FREQUENCY[id] ?? 0;

/** As palavras legíveis na ordem em que valem a pena: N5 antes de N4..., e dentro do nível as mais usadas primeiro. */
export function readableWordsByPriority(known: ReadonlySet<string>) {
  return readableWords(known).sort((a, b) => {
    const level = LEVEL_RANK[wordLevelOfGroup(a.group)] - LEVEL_RANK[wordLevelOfGroup(b.group)];
    return level !== 0 ? level : wordFrequency(b.id) - wordFrequency(a.id);
  });
}

/** Quantas palavras de cada rodada saem do topo da lista: o sorteio acontece só entre as mais básicas. */
const TOP_POOL_FACTOR = 3;

/** Dica curta sobre o sinal da palavra que precisa de explicação (っ, kana pequeno, ー), ou undefined. */
export function readingTip(word: string, romaji: string): string | undefined {
  const chars = [...word];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i] as string;
    const next = chars[i + 1];
    if (SOKUON.has(c)) return `o ${c} dobra a consoante seguinte (${romaji}): faça uma pausa curta antes dela.`;
    if (next && SMALL_Y.has(next)) return `${c}${next} se lê numa sílaba só (${kanaToRomaji(c + next)}), não em duas.`;
    if (c === LONG) return 'o traço ー alonga a vogal: segure o som por duas batidas.';
  }
  return undefined;
}

/**
 * Leitura de palavras: mostra a palavra em kana e a pessoa escolhe o significado. Alternativas com significados
 * diferentes, de palavras que ela também consegue ler. Devolve [] se há palavras de menos.
 */
export function buildReadQuestions(known: ReadonlySet<string>, rng: Rng = Math.random, count: number = READ_WORDS): Question[] {
  const byMeaning = new Map<string, PairItem>();
  for (const w of readableWordsByPriority(known)) {
    const meaning = w.meaning.trim();
    if (byMeaning.has(meaning)) continue;
    const romaji = w.romaji ?? kanaToRomaji(w.reading);
    const tip = readingTip(w.jp, romaji);
    byMeaning.set(meaning, {
      char: w.jp,
      label: meaning,
      script: 'pair',
      reading: w.reading,
      romaji,
      explain: `${w.jp} (${romaji}) = ${meaning}${tip ? ` · Dica: ${tip}` : ''}`,
    });
  }
  const items = [...byMeaning.values()]; // já na ordem de prioridade
  if (items.length < 4) return [];
  // As perguntas saem do topo da lista (as mais básicas); as alternativas erradas podem vir de qualquer palavra legível.
  const top = items.slice(0, Math.max(count * TOP_POOL_FACTOR, 30));
  return shuffle(top, rng)
    .slice(0, count)
    .map((item) => {
      const distractors = shuffle(
        items.filter((x) => x.label !== item.label),
        rng,
      ).slice(0, 3);
      return { item, direction: 'k2r' as const, options: shuffle([item, ...distractors], rng), retry: false };
    });
}

/** Quantas palavras entram, no máximo, numa revisão normal. */
export const WORDS_IN_REVIEW = 3;
/** A revisão precisa ter pelo menos isto de perguntas de kana para ganhar palavras (sem encher sessões curtas). */
const MIN_QUESTIONS_FOR_WORDS = 6;

/**
 * Revisão com contexto: depois de algumas linhas de kana aprendidas, mistura até 3 palavras curtas (feitas só de
 * kana já conhecidos) entre as perguntas de kana. Palavras não têm cartão de kana: quem grava a resposta
 * deve tratá-las à parte (`isStudyItem` falso).
 */
export function withWordQuestions(questions: readonly Question[], known: ReadonlySet<string>, rng: Rng = Math.random): Question[] {
  if (known.size < MIN_KNOWN_FOR_WORDS || questions.length < MIN_QUESTIONS_FOR_WORDS) return [...questions];
  const words = buildReadQuestions(known, rng, WORDS_IN_REVIEW);
  const out = [...questions];
  for (const w of words) out.splice(Math.floor(rng() * (out.length + 1)), 0, w);
  return out;
}
