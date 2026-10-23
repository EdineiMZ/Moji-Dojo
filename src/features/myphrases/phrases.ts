import { normalizeJapanese } from '@/features/translate/check';

/** Uma frase do próprio aluno: o japonês que ele escreveu, o que quis dizer e o agendamento da revisão. */
export interface MyPhrase {
  jp: string;
  pt: string;
  /** Quando foi escrita (ms). */
  at: number;
  /** Caixa da revisão espaçada e quando vence (ms). */
  b: number;
  due: number;
}

export type MyPhrases = Readonly<Record<string, MyPhrase>>;

export const MAX_MY_PHRASES = 300;
export const MAX_PHRASE_LENGTH = 200;

const JAPANESE = /[぀-ヿ㐀-鿿]/;

export type PhraseProblem = 'empty-jp' | 'empty-pt' | 'not-japanese' | 'too-long' | 'duplicate' | 'full';

export const PROBLEM_MESSAGES: Readonly<Record<PhraseProblem, string>> = {
  'empty-jp': 'Escreva a frase em japonês.',
  'empty-pt': 'Escreva o que a frase quer dizer, em português.',
  'not-japanese': 'A frase precisa ter letras japonesas (hiragana, katakana ou kanji).',
  'too-long': `Use no máximo ${MAX_PHRASE_LENGTH} letras em cada campo.`,
  duplicate: 'Você já salvou essa frase.',
  full: `Você chegou ao limite de ${MAX_MY_PHRASES} frases. Apague alguma para salvar outra.`,
};

/** Por que a frase não pode ser salva (ou null se pode). `ignoreId` é a frase que está sendo editada. */
export function checkPhrase(jp: string, pt: string, existing: MyPhrases, ignoreId?: string): PhraseProblem | null {
  const written = jp.trim();
  const meaning = pt.trim();
  if (!written) return 'empty-jp';
  if (!meaning) return 'empty-pt';
  if (!JAPANESE.test(written)) return 'not-japanese';
  if (written.length > MAX_PHRASE_LENGTH || meaning.length > MAX_PHRASE_LENGTH) return 'too-long';
  const key = normalizeJapanese(written);
  const others = Object.entries(existing).filter(([id]) => id !== ignoreId);
  if (others.some(([, p]) => normalizeJapanese(p.jp) === key)) return 'duplicate';
  if (ignoreId === undefined && others.length >= MAX_MY_PHRASES) return 'full';
  return null;
}

/** Identificador novo: o momento em base 36 (e um sufixo se já existir). */
export function newPhraseId(existing: MyPhrases, now: number): string {
  const base = `m${now.toString(36)}`;
  if (!(base in existing)) return base;
  for (let n = 2; ; n++) if (!(`${base}-${n}` in existing)) return `${base}-${n}`;
}

/** Frases com a revisão vencida, da mais atrasada para a menos. */
export function duePhrases(phrases: MyPhrases, now: number): string[] {
  return Object.entries(phrases)
    .filter(([, p]) => p.due <= now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id]) => id);
}

/** Todas as frases, da mais nova para a mais antiga. */
export const newestFirst = (phrases: MyPhrases): [string, MyPhrase][] =>
  Object.entries(phrases).sort((a, b) => b[1].at - a[1].at);

/** Ideias do que escrever, para quem não sabe por onde começar (em português; cada um escreve a sua versão). */
export const PHRASE_IDEAS: readonly string[] = [
  'Eu moro em [sua cidade].',
  'Eu gosto de [uma comida].',
  'Eu trabalho em [lugar].',
  'Eu não gosto de [algo].',
  'Eu vou para [lugar] amanhã.',
  'Eu quero comer [algo].',
  'Hoje está [quente / frio].',
  'Eu tenho [uma irmã / um gato].',
];
