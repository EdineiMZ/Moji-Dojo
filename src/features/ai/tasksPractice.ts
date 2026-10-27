import type { DialogOption, DialogTurn } from '@/content/dialogs';
import { kanaToRomaji } from '@/lib/romaji';
import { shuffle, type Rng } from '@/features/quiz/quiz';
import { HONESTY, isRecord, PHRASE_TOPICS, TEACHER, text } from './tasks';
import { ask } from './useAi';

// ─── Diálogos novos ──────────────────────────────────────────────────────

/** Só kana e espaço: as cenas fixas do app também não usam kanji nem pontuação. */
const KANA_LINE = /^[ぁ-ゟァ-ヿー ]+$/;

const PARTICLES: ReadonlySet<string> = new Set(['は', 'へ', 'を']);

/** Romaji de uma palavra em kana; は, へ e を soltos ou no fim da palavra (のみものは, えきへ) são partículas. */
function wordRomaji(word: string): string {
  const last = word.at(-1) ?? '';
  if (PARTICLES.has(word)) return kanaToRomaji(word, { particle: true });
  if (word.length > 1 && PARTICLES.has(last)) return kanaToRomaji(word.slice(0, -1)) + kanaToRomaji(last, { particle: true });
  return kanaToRomaji(word);
}

/** Romaji de uma fala em kana separada por espaços. */
export function sceneRomaji(jp: string): string {
  return jp
    .split(/\s+/)
    .filter((w) => w !== '')
    .map(wordRomaji)
    .join(' ');
}

/** A fala só com kana: a pontuação vira espaço (como nas cenas fixas) e kanji ou romaji invalidam a linha. */
const kanaLine = (v: unknown, max: number): string => {
  const line = text(v, max)
    .replace(/[。、！？!?,.]+/g, ' ')
    .replace(/[\s　]+/g, ' ')
    .trim();
  return KANA_LINE.test(line) ? line : '';
};

export const MIN_YOU_TURNS = 2;
export const MAX_YOU_TURNS = 5;
const MAX_TURNS = 14;

function parseOptions(raw: unknown): DialogOption[] {
  const seen = new Set<string>();
  const options: DialogOption[] = [];
  for (const o of Array.isArray(raw) ? raw : []) {
    if (!isRecord(o)) continue;
    const jp = kanaLine(o.jp, 60);
    const pt = text(o.pt, 120);
    const ok = o.ok === true;
    const why = text(o.why, 220);
    if (!jp || !pt || seen.has(jp) || (!ok && !why)) continue;
    seen.add(jp);
    options.push({ jp, romaji: sceneRomaji(jp), pt, ok, ...(ok ? {} : { why }) });
  }
  const right = options.filter((o) => o.ok);
  // Uma só certa e pelo menos uma errada; duas "certas" quase sempre são um erro da IA.
  return right.length === 1 && options.length >= 2 ? options.slice(0, 4) : [];
}

export interface GeneratedScene {
  title: string;
  intro: string;
  turns: readonly DialogTurn[];
}

/** Valida uma cena: falas do atendente em kana, turnos do aluno com uma só resposta certa e o porquê das erradas. */
export function parseScene(json: unknown): GeneratedScene | null {
  if (!isRecord(json) || !Array.isArray(json.turns)) return null;
  const title = text(json.title, 60);
  const intro = text(json.intro, 240);
  if (!title || !intro) return null;

  const turns: DialogTurn[] = [];
  let youCount = 0;
  for (const raw of json.turns.slice(0, MAX_TURNS)) {
    if (!isRecord(raw)) continue;
    if (raw.kind === 'narrator') {
      const pt = text(raw.pt, 160);
      if (pt) turns.push({ kind: 'narrator', pt });
    } else if (raw.kind === 'staff') {
      const jp = kanaLine(raw.jp, 80);
      const pt = text(raw.pt, 160);
      if (jp && pt) turns.push({ kind: 'staff', jp, romaji: sceneRomaji(jp), pt });
    } else if (raw.kind === 'you' && youCount < MAX_YOU_TURNS) {
      const options = parseOptions(raw.options);
      if (options.length > 0) {
        turns.push({ kind: 'you', options });
        youCount++;
      }
    }
  }
  return youCount >= MIN_YOU_TURNS ? { title, intro, turns } : null;
}

const sceneSystem = (youTurns: number): string => `${TEACHER}
Crie uma cena curta de conversa para o aluno treinar escolhendo a resposta certa em cada momento. Alguém (atendente, colega, funcionário) fala em japonês e o aluno escolhe, entre alternativas, o que dizer. ${HONESTY}
REGRAS:
- Escreva todo o japonês só em HIRAGANA ou KATAKANA, sem kanji, sem romaji e SEM pontuação, com ESPAÇO entre as palavras e as partículas sempre separadas (わたし は, ほん を, のみもの は, えき へ). Frases curtas e naturais, nível N5.
- A cena tem ${youTurns} turnos do aluno ("you"). A pessoa fala primeiro ("staff"); entre os turnos do aluno haja uma fala "staff". Pode haver no máximo uma "narrator" no começo.
- Em cada turno do aluno, 3 alternativas: UMA certa (ok: true) e DUAS erradas (ok: false). As erradas precisam ser frases japonesas reais e corretas, mas que NÃO cabem naquele momento (resposta a outra pergunta, ou na situação errada). Nunca deixe uma errada que também serviria. Em "why", explique em português, em uma frase, por que não serve ali.
Responda SOMENTE com JSON:
{"title": string, "intro": string, "turns": [{"kind": "narrator", "pt": string} | {"kind": "staff", "jp": string, "pt": string} | {"kind": "you", "options": [{"jp": string, "pt": string, "ok": boolean, "why": string}]}]}
- title: título curto em português. intro: 1 frase em português dizendo onde o aluno está e o que vai acontecer.`;

export interface SceneRequest {
  topic: (typeof PHRASE_TOPICS)[number];
  /** Palavras que o aluno já aprendeu (amostra). */
  known: readonly string[];
  seed: number;
}

export const SCENE_YOU_TURNS = 4;

/** Cria uma cena de diálogo nova sobre um tema, com o vocabulário do aluno como referência. */
export function generateScene({ topic, known, seed }: SceneRequest): Promise<GeneratedScene> {
  const sample = known.slice(0, 60).join('、');
  return ask({
    system: sceneSystem(SCENE_YOU_TURNS),
    user: `Tema: ${topic.prompt}.${sample ? `\nPalavras que o aluno já conhece: ${sample}.` : ''}\nVariação nº ${seed % 1000}.`,
    maxTokens: 6000,
    parse: parseScene,
    // Sem cache: cada pedido deve trazer uma cena nova.
  });
}

// ─── Simulado estilo JLPT ────────────────────────────────────────────────

export type ExamLevel = 'N5' | 'N4';
export type ExamSection = 'vocab' | 'grammar' | 'reading' | 'kanji';

export const EXAM_LEVELS: readonly { value: ExamLevel; label: string; hint: string }[] = [
  { value: 'N5', label: 'N5', hint: 'です/ます, partículas básicas, kanji simples' },
  { value: 'N4', label: 'N4', hint: 'forma て e た, あげる/もらう, ～たい, ～ながら, ～から/～ので, comparações' },
];

export const EXAM_SECTIONS: readonly { value: ExamSection; label: string; prompt: string }[] = [
  {
    value: 'vocab',
    label: 'Vocabulário',
    prompt:
      'vocabulário, em dois formatos (metade de cada): (1) leitura: o "prompt" é uma frase com a palavra em kanji entre 「」 seguida da pergunta, por exemplo "わたしは 「学生」 です。 「学生」の よみかたは？", e as 4 alternativas são leituras em hiragana parecidas entre si; (2) palavra certa: o "prompt" é uma frase com ＿＿＿ e as 4 alternativas são palavras que combinam em forma, mas só uma em sentido',
  },
  {
    value: 'kanji',
    label: 'Kanji',
    prompt:
      'kanji (só os mais comuns do N5), em dois formatos (metade de cada): (1) escrita: o "prompt" é uma frase com a palavra em hiragana entre 「」 seguida da pergunta, por exemplo "あした 「がっこう」 へ いきます。 「がっこう」の かんじは？", e as 4 alternativas são escritas em kanji parecidas ou com um kanji trocado; (2) leitura: o "prompt" traz a palavra em kanji entre 「」 e pergunta o seu よみかた, com 4 leituras em hiragana',
  },
  { value: 'grammar', label: 'Gramática', prompt: 'gramática: uma frase com ＿＿＿ para completar com a partícula, a forma do verbo ou a expressão certa' },
  {
    value: 'reading',
    label: 'Leitura',
    prompt: 'leitura: um texto de 2 a 3 frases curtas no campo "passage" e uma pergunta de compreensão sobre ele, em japonês simples, no campo "prompt"',
  },
];

export const EXAM_SIZES: readonly number[] = [5, 10];

export interface ExamQuestion {
  /** O enunciado, em japonês. */
  prompt: string;
  /** Texto para ler (só na seção de leitura). */
  passage: string;
  /** Tradução do enunciado e do texto, para conferir depois de responder. */
  pt: string;
  options: readonly string[];
  /** Posição da alternativa certa em `options`. */
  answer: number;
  /** Gabarito comentado: por que a certa serve e as outras não. */
  explanation: string;
}

const OPTION_COUNT = 4;
export const MIN_EXAM_QUESTIONS = 3;

/** O gabarito fala de "alternativa 2" ou "a terceira opção", mas as alternativas são embaralhadas: a explicação ficaria errada. */
const POSITIONAL = /\b(alternativa|opção|opcao|item|letra)\s*(n[ºo°.]?\s*)?[1-4a-d]\b|\b(primeira|segunda|terceira|quarta|última)\s+(alternativa|opção)|\([1-4a-d]\)/i;

/**
 * Valida as questões e descarta as que a própria IA contradiz (a alternativa certa copiada não bate com o índice) ou
 * cujo gabarito cita a posição das alternativas. Na seção de leitura o texto é obrigatório; nas outras, é ignorado.
 */
export function parseExam(json: unknown, withPassage = false): ExamQuestion[] | null {
  const list = isRecord(json) ? json.questions : json;
  if (!Array.isArray(list)) return null;
  const out: ExamQuestion[] = [];
  for (const q of list) {
    if (!isRecord(q) || !Array.isArray(q.options)) continue;
    const options = q.options.map((o) => text(o, 60));
    if (options.length !== OPTION_COUNT || options.some((o) => o === '') || new Set(options).size !== OPTION_COUNT) continue;
    const prompt = text(q.prompt, 240);
    const explanation = text(q.explanation, 600);
    const answerText = text(q.answerText, 60);
    const passage = withPassage ? text(q.passage, 400) : '';
    if (!prompt || !explanation || (withPassage && !passage) || POSITIONAL.test(explanation) || typeof q.answer !== 'number' || !Number.isInteger(q.answer)) continue;
    if (q.answer < 0 || q.answer >= OPTION_COUNT || options[q.answer] !== answerText) continue;
    out.push({ prompt, passage, pt: text(q.pt, 400), options, answer: q.answer, explanation });
  }
  return out.length >= MIN_EXAM_QUESTIONS ? out : null;
}

/** Embaralha as alternativas (as IAs tendem a pôr a certa nas mesmas posições) e acerta o índice da certa. */
export function shuffleQuestion(question: ExamQuestion, rng: Rng = Math.random): ExamQuestion {
  const right = question.options[question.answer];
  const options = shuffle(question.options, rng);
  return { ...question, options, answer: options.indexOf(right as string) };
}

const examSystem = (level: ExamLevel, section: (typeof EXAM_SECTIONS)[number], count: number): string => `${TEACHER}
Crie ${count} questões de múltipla escolha no estilo do JLPT ${level}, seção de ${section.prompt}. ${HONESTY}
REGRAS:
- Japonês natural e correto, com o vocabulário e a gramática do ${level} (${EXAM_LEVELS.find((l) => l.value === level)?.hint ?? ''}).
- 4 alternativas curtas, só UMA correta; as outras são claramente erradas, sem ambiguidade. Nunca deixe duas respostas aceitáveis.
- Sem pegadinha de cultura ou de palavra rara. Não repita o mesmo ponto em duas questões.
- Escreva cada palavra inteira em um só sistema: toda em kanji (月曜日) ou toda em hiragana (げつようび), nunca misturados no meio da palavra. Não use romaji.
- As alternativas serão embaralhadas: no "explanation" NUNCA cite posição ("alternativa 2", "a primeira", "letra B"); cite sempre o texto da alternativa.
- Escreva "explanation" ANTES de decidir a resposta: em português, de 2 a 3 frases, dizendo por que a certa serve e por que as outras não. Depois copie a alternativa certa em "answerText" e dê a posição dela (0 a 3) em "answer".
Responda SOMENTE com JSON:
{"questions": [{"prompt": string, "passage": string, "pt": string, "options": [string, string, string, string], "explanation": string, "answerText": string, "answer": number}]}
- passage: só na seção de leitura (obrigatório nela); nas outras, "". pt: tradução do enunciado (e do texto) para o português.`;

export interface ExamRequest {
  level: ExamLevel;
  section: ExamSection;
  count: number;
  seed: number;
}

/** Cria um simulado: questões da seção e do nível pedidos, com gabarito comentado e alternativas embaralhadas. */
export async function generateExam({ level, section, count, seed }: ExamRequest): Promise<ExamQuestion[]> {
  const chosen = EXAM_SECTIONS.find((s) => s.value === section) ?? (EXAM_SECTIONS[0] as (typeof EXAM_SECTIONS)[number]);
  const questions = await ask({
    system: examSystem(level, chosen, count),
    user: `Variação nº ${seed % 1000}.`,
    // Folga para modelos que "pensam" antes de responder: o raciocínio também conta no limite de saída.
    maxTokens: 700 * count + 2500,
    parse: (json) => parseExam(json, section === 'reading'),
    // Sem cache: cada simulado deve ser novo.
  });
  return questions.slice(0, count).map((q) => shuffleQuestion(q));
}
