import { VOCAB } from '@/content';
import { ALL_GRAMMAR } from '@/content/grammar';
import { ALL_KANJI, kanjiLevelOf } from '@/content/kanji';
import { shuffle, type Rng } from '@/features/quiz/quiz';
import { isSecondaryTwin } from '@/features/vocab/twins';

/**
 * Simulado offline: perguntas montadas só com o conteúdo do app (vocabulário, kanji e frases de gramática), sem IA e sem
 * internet. Cada seção tem a própria nota.
 */
export type ExamLevel = 'N5' | 'N4';
export type ExamSection = 'vocab' | 'reading' | 'kanji' | 'grammar';

export const EXAM_LEVELS: readonly ExamLevel[] = ['N5', 'N4'];

export const EXAM_SECTIONS: readonly { id: ExamSection; label: string; hint: string }[] = [
  { id: 'vocab', label: 'Vocabulário', hint: 'o significado das palavras' },
  { id: 'reading', label: 'Leitura', hint: 'como se lê uma palavra com kanji' },
  { id: 'kanji', label: 'Kanji', hint: 'o significado de cada kanji' },
  { id: 'grammar', label: 'Gramática', hint: 'o que quer dizer uma frase' },
];

/** Perguntas por seção que o aluno pode escolher. */
export const EXAM_SIZES: readonly number[] = [5, 8, 10];

export interface ExamQuestion {
  section: ExamSection;
  /** O enunciado, em português, com o japonês entre 「」. */
  prompt: string;
  options: readonly string[];
  /** Posição da alternativa certa em `options`. */
  answer: number;
  /** O gabarito: a resposta certa explicada com o que o app ensina. */
  explanation: string;
}

const KANJI = /[一-鿿]/;

/** Pega até `n` itens distintos de `pool`, sem os de `exclude`. */
function pickDistinct<T>(pool: readonly T[], n: number, rng: Rng, exclude: ReadonlySet<T>): T[] {
  const out: T[] = [];
  for (const item of shuffle(pool, rng)) {
    if (out.length >= n) break;
    if (!exclude.has(item) && !out.includes(item)) out.push(item);
  }
  return out;
}

/** Monta uma questão: a certa e três erradas, embaralhadas. Devolve null se não há erradas suficientes. */
function question(section: ExamSection, prompt: string, right: string, wrong: readonly string[], explanation: string, rng: Rng): ExamQuestion | null {
  const unique = [...new Set(wrong)].filter((w) => w !== right).slice(0, 3);
  if (unique.length < 3) return null;
  const options = shuffle([right, ...unique], rng);
  return { section, prompt, options, answer: options.indexOf(right), explanation };
}

const levelWords = (level: ExamLevel) => VOCAB.filter((w) => !isSecondaryTwin(w.id) && w.group.startsWith('N4:') === (level === 'N4'));

/** Os kanji do N4 são os dos grupos "N4: ..."; os do N5 são os demais, menos os do N3 (que ainda não têm simulado). */
function levelKanji(level: ExamLevel) {
  return ALL_KANJI.filter((k) => kanjiLevelOf(k) === level);
}

/** Os tópicos de gramática do N4 têm o prefixo "n4-" no id. */
const levelTopics = (level: ExamLevel) => ALL_GRAMMAR.filter((t) => t.id.startsWith('n4-') === (level === 'N4'));

function vocabQuestions(level: ExamLevel, count: number, rng: Rng): ExamQuestion[] {
  const words = levelWords(level);
  const meanings = [...new Set(words.map((w) => w.meaning))];
  const out: ExamQuestion[] = [];
  for (const w of shuffle(words, rng)) {
    if (out.length >= count) break;
    const wrong = pickDistinct(meanings, 3, rng, new Set([w.meaning]));
    const reading = w.reading !== w.jp ? ` (${w.reading})` : '';
    const q = question('vocab', `Qual é o significado de 「${w.jp}」?`, w.meaning, wrong, `${w.jp}${reading} = ${w.meaning}.`, rng);
    if (q) out.push(q);
  }
  return out;
}

function readingQuestions(level: ExamLevel, count: number, rng: Rng): ExamQuestion[] {
  const words = levelWords(level).filter((w) => KANJI.test(w.jp) && w.reading !== w.jp);
  const readings = [...new Set(words.map((w) => w.reading))];
  const out: ExamQuestion[] = [];
  for (const w of shuffle(words, rng)) {
    if (out.length >= count) break;
    // Alternativas parecidas (de tamanho próximo), como na prova.
    const near = readings.filter((r) => r !== w.reading && Math.abs([...r].length - [...w.reading].length) <= 1);
    const wrong = pickDistinct(near.length >= 3 ? near : readings, 3, rng, new Set([w.reading]));
    const q = question('reading', `Como se lê 「${w.jp}」?`, w.reading, wrong, `${w.jp} lê-se ${w.reading} e quer dizer "${w.meaning}".`, rng);
    if (q) out.push(q);
  }
  return out;
}

function kanjiQuestions(level: ExamLevel, count: number, rng: Rng): ExamQuestion[] {
  const kanji = levelKanji(level);
  const meanings = [...new Set(kanji.map((k) => k.meaning))];
  const out: ExamQuestion[] = [];
  for (const k of shuffle(kanji, rng)) {
    if (out.length >= count) break;
    const wrong = pickDistinct(meanings, 3, rng, new Set([k.meaning]));
    const readings = [...k.on, ...k.kun].slice(0, 3).join(', ');
    const q = question('kanji', `Qual é o significado do kanji 「${k.char}」?`, k.meaning, wrong, `${k.char} = ${k.meaning}${readings ? ` (leituras: ${readings})` : ''}.`, rng);
    if (q) out.push(q);
  }
  return out;
}

function grammarQuestions(level: ExamLevel, count: number, rng: Rng): ExamQuestion[] {
  const topics = levelTopics(level);
  const examples = topics.flatMap((t) => t.examples.map((e) => ({ topic: t, example: e })));
  const translations = [...new Set(topics.flatMap((t) => t.examples.map((e) => e.pt)))];
  const out: ExamQuestion[] = [];
  for (const { topic, example } of shuffle(examples, rng)) {
    if (out.length >= count) break;
    const wrong = pickDistinct(translations, 3, rng, new Set([example.pt]));
    const q = question('grammar', `O que quer dizer 「${example.jp.replace(/ /g, '')}」?`, example.pt, wrong, `${example.jp.replace(/ /g, '')} (${example.romaji}) = ${example.pt} Tópico: ${topic.title}.`, rng);
    if (q) out.push(q);
  }
  return out;
}

/** O simulado de um nível: `perSection` perguntas em cada seção (a menos que o conteúdo do nível seja menor), seção por seção. */
export function buildExam(level: ExamLevel, perSection: number, rng: Rng = Math.random): ExamQuestion[] {
  return [...vocabQuestions(level, perSection, rng), ...readingQuestions(level, perSection, rng), ...kanjiQuestions(level, perSection, rng), ...grammarQuestions(level, perSection, rng)];
}

export interface SectionScore {
  section: ExamSection;
  correct: number;
  total: number;
  pct: number;
}

/** A nota de cada seção (e só das seções que tiveram perguntas), na ordem da prova. */
export function scoreBySection(questions: readonly ExamQuestion[], results: readonly boolean[]): SectionScore[] {
  return EXAM_SECTIONS.flatMap(({ id }) => {
    const idx = questions.map((q, i) => (q.section === id ? i : -1)).filter((i) => i >= 0);
    if (idx.length === 0) return [];
    const correct = idx.filter((i) => results[i]).length;
    return [{ section: id, correct, total: idx.length, pct: Math.round((correct / idx.length) * 100) }];
  });
}
