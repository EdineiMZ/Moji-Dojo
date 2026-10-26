import { HONESTY, isRecord, PHRASE_TOPICS, quoted, TEACHER, text, unknownParts } from './tasks';
import { ask } from './useAi';

// ─── Mnemônico para itens teimosos ───────────────────────────────────────

export interface Mnemonic {
  mnemonic: string;
  /** Um jeito de treinar diferente do de sempre (uma frase). */
  practice: string;
}

const MNEMONIC_SYSTEM = `${TEACHER}
O aluno esquece sempre um item (um kana, uma palavra, uma forma de verbo ou uma partícula). Crie uma dica de memória criativa, curta e fácil de visualizar, em português do Brasil, que ligue o item ao som ou ao significado (imagem, historinha ou comparação com uma palavra do português). ${HONESTY}
Não invente etimologia: se for só uma associação sua, assuma que é uma associação.
Responda SOMENTE com JSON: {"mnemonic": string, "practice": string}
- mnemonic: a dica, de 1 a 3 frases.
- practice: uma sugestão de treino diferente de repetir (uma frase).`;

export function parseMnemonic(json: unknown): Mnemonic | null {
  if (!isRecord(json)) return null;
  const mnemonic = text(json.mnemonic, 500);
  return mnemonic ? { mnemonic, practice: text(json.practice, 300) } : null;
}

const AREA_NAMES: Readonly<Record<string, string>> = { kana: 'kana', vocab: 'palavra', conj: 'forma de verbo', particle: 'partícula' };

/** Pede uma dica de memória para o item que o aluno esquece sempre. */
export function makeMnemonic(area: string, label: string): Promise<Mnemonic> {
  const kind = AREA_NAMES[area] ?? 'item';
  return ask({
    system: MNEMONIC_SYSTEM,
    user: `Tipo: ${kind}. Item: <aluno>${quoted(label)}</aluno>`,
    maxTokens: 700,
    parse: parseMnemonic,
    cacheKey: `mn:${area}:${quoted(label)}`,
  });
}

// ─── Avaliar o que o aluno entendeu ──────────────────────────────────────

export type MeaningVerdict = 'ok' | 'close' | 'wrong';

export interface MeaningJudgement {
  verdict: MeaningVerdict;
  note: string;
}

const MEANING_SYSTEM = `${TEACHER}
Compare o que o aluno entendeu de uma frase japonesa com a tradução de referência. Aceite outras formas de dizer a mesma coisa; só considere errado se o sentido mudou. ${HONESTY}
Responda SOMENTE com JSON: {"verdict": "ok" | "close" | "wrong", "note": string}
- ok: o sentido está certo. close: pegou a ideia mas faltou ou trocou algo importante. wrong: o sentido é outro.
- note: 1 ou 2 frases em português, dizendo o que está certo e o que faltou, sem repetir a tradução inteira.`;

export function parseMeaning(json: unknown): MeaningJudgement | null {
  if (!isRecord(json)) return null;
  const verdict = json.verdict;
  if (verdict !== 'ok' && verdict !== 'close' && verdict !== 'wrong') return null;
  const note = text(json.note, 400);
  return note ? { verdict, note } : null;
}

/** Avalia o português livre do aluno contra a tradução de referência (a lacuna do "Entender (livre)"). */
export function judgeMeaning(jp: string, reference: string, answer: string): Promise<MeaningJudgement> {
  return ask({
    system: MEANING_SYSTEM,
    user: `Frase em japonês: ${quoted(jp)}\nTradução de referência: ${quoted(reference)}\nO que o aluno entendeu: <aluno>${quoted(answer)}</aluno>`,
    maxTokens: 500,
    parse: parseMeaning,
    cacheKey: `mean:${quoted(jp)}|${quoted(answer)}`,
  });
}

// ─── Treinador de registro ───────────────────────────────────────────────

export type Register = 'casual' | 'polite' | 'formal';

export const REGISTER_LABELS: Readonly<Record<Register, string>> = {
  casual: 'Casual (amigos e família)',
  polite: 'Educado (です/ます, o padrão)',
  formal: 'Formal (clientes e superiores)',
};
export const REGISTER_ORDER: readonly Register[] = ['casual', 'polite', 'formal'];

export interface RegisterVersion {
  register: Register;
  jp: string;
  reading: string;
  /** Quando usar esta forma, em português. */
  when: string;
}

export interface RegisterSet {
  /** O que a frase quer dizer. */
  pt: string;
  versions: readonly RegisterVersion[];
  note: string;
}

const REGISTER_SYSTEM = `${TEACHER}
O aluno digitou uma frase (em português ou em japonês). Escreva a mesma ideia em três registros do japonês e explique quando usar cada um. ${HONESTY}
Se a frase do aluno for japonesa e tiver erro, use a versão corrigida e avise na observação. Mantenha a frase simples, no nível do aluno.
Responda SOMENTE com JSON:
{"pt": string, "versions": [{"register": "casual" | "polite" | "formal", "jp": string, "reading": string, "when": string}], "note": string}
- pt: o que a frase quer dizer, em português.
- versions: as três, nesta ordem: casual (forma simples, com amigos), polite (です/ます), formal (keigo, com clientes e superiores). jp com kanji simples; reading em hiragana.
- when: 1 frase em português sobre quando usar.
- note: diferença mais importante entre as formas, ou "".`;

export function parseRegisters(json: unknown): RegisterSet | null {
  if (!isRecord(json)) return null;
  const pt = text(json.pt, 300);
  const seen = new Set<Register>();
  const versions: RegisterVersion[] = [];
  for (const v of Array.isArray(json.versions) ? json.versions : []) {
    if (!isRecord(v)) continue;
    const register = REGISTER_ORDER.find((r) => r === v.register);
    const jp = text(v.jp, 200);
    if (!register || !jp || seen.has(register)) continue;
    seen.add(register);
    versions.push({ register, jp, reading: text(v.reading, 300), when: text(v.when, 250) });
  }
  if (!pt || versions.length === 0) return null;
  versions.sort((a, b) => REGISTER_ORDER.indexOf(a.register) - REGISTER_ORDER.indexOf(b.register));
  return { pt, versions, note: text(json.note, 400) };
}

export const MAX_REGISTER_INPUT = 120;

/** Reescreve a frase em casual, educado e formal. */
export function rewriteRegisters(sentence: string): Promise<RegisterSet> {
  const clean = quoted(sentence).slice(0, MAX_REGISTER_INPUT);
  return ask({
    system: REGISTER_SYSTEM,
    user: `Frase: <aluno>${clean}</aluno>`,
    maxTokens: 1200,
    parse: parseRegisters,
    cacheKey: `reg:${clean}`,
  });
}

// ─── Textos graduados sob medida ─────────────────────────────────────────

export interface StorySentence {
  jp: string;
  reading: string;
  pt: string;
}

export interface Story {
  title: string;
  sentences: readonly StorySentence[];
}

export type StoryLength = 'short' | 'medium';
export const STORY_SENTENCES: Readonly<Record<StoryLength, number>> = { short: 4, medium: 7 };

const storySystem = (count: number): string => `${TEACHER}
Escreva um texto curto de leitura em japonês, com ${count} frases, sobre o tema pedido, para o aluno praticar leitura. ${HONESTY}
REGRAS: nível N5 (です/ます, partículas básicas, frases curtas); use o vocabulário que o aluno já conhece sempre que der; kanji só os mais simples do N5; uma pequena história ou situação com começo e fim, que faça sentido.
Responda SOMENTE com JSON: {"title": string, "sentences": [{"jp": string, "reading": string, "pt": string}]}
- title: título curto em português.
- jp: a frase em japonês; reading: a mesma frase toda em hiragana (para a voz e o furigana); pt: tradução em português do Brasil.`;

export function parseStory(json: unknown): Story | null {
  if (!isRecord(json) || !Array.isArray(json.sentences)) return null;
  const sentences = json.sentences
    .filter(isRecord)
    .map((s) => ({ jp: text(s.jp, 200), reading: text(s.reading, 300), pt: text(s.pt, 300) }))
    .filter((s) => s.jp && s.pt)
    .slice(0, 12);
  const title = text(json.title, 80);
  return sentences.length >= 2 && title ? { title, sentences } : null;
}

/** Quantas frases do texto só usam o que o léxico do app reconhece (pela leitura em hiragana). */
export function knownShare(story: Story): { known: number; total: number } {
  const known = story.sentences.filter((s) => s.reading !== '' && unknownParts(s.reading.replace(/[\s　]/g, '')).length === 0).length;
  return { known, total: story.sentences.length };
}

export interface StoryRequest {
  topic: (typeof PHRASE_TOPICS)[number];
  length: StoryLength;
  /** Palavras que o aluno já aprendeu (amostra), como estão escritas. */
  known: readonly string[];
  seed: number;
}

/** Cria um texto de leitura sobre um tema com o vocabulário do aluno. */
export function generateStory({ topic, length, known, seed }: StoryRequest): Promise<Story> {
  const sample = known.slice(0, 80).join('、');
  return ask({
    system: storySystem(STORY_SENTENCES[length]),
    user: `Tema: ${topic.prompt}.${sample ? `\nPalavras que o aluno já conhece: ${sample}.` : ''}\nVariação nº ${seed % 1000}.`,
    maxTokens: 2200,
    parse: parseStory,
  });
}
