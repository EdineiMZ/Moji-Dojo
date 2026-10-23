import { segment, type Token } from '@/features/bank/lexicon';

/** O papel de um bloco na frase, pela partícula que vem depois dele (ou por ser o fim da frase). */
export type BlockRole =
  | 'topic'
  | 'subject'
  | 'object'
  | 'target'
  | 'place'
  | 'direction'
  | 'possessor'
  | 'with'
  | 'also'
  | 'from'
  | 'until'
  | 'detail'
  | 'predicate';

export interface Block {
  /** O bloco como aparece na frase (a palavra, com a partícula colada). */
  text: string;
  role: BlockRole;
  /** A partícula do bloco, se tiver ("は", "を", "に"...). */
  particle: string | null;
}

export interface RoleInfo {
  label: string;
  /** Como o aluno enxerga este papel, em uma frase. */
  explain: string;
}

export const ROLES: Readonly<Record<BlockRole, RoleInfo>> = {
  topic: { label: 'Tema (は)', explain: 'O assunto da frase: "quanto a isto...". は fica logo depois dele.' },
  subject: { label: 'Sujeito (が)', explain: 'Quem faz ou quem é, com destaque. Responde "quem?" ou "o que?".' },
  object: { label: 'Objeto (を)', explain: 'O que recebe a ação: o que se come, se pede, se compra.' },
  target: { label: 'Alvo (に)', explain: 'Para onde, quando ou para quem: o ponto de chegada da ação, a hora ou a pessoa.' },
  place: { label: 'Lugar ou meio (で)', explain: 'Onde a ação acontece, ou com o que se faz (cartão, trem, hashi).' },
  direction: { label: 'Direção (へ)', explain: 'Para onde se vai. Parecido com に, mas só para destino.' },
  possessor: { label: 'Posse (の)', explain: 'Liga dois nomes: "de". わたしの なまえ = meu nome.' },
  with: { label: 'Com / e (と)', explain: 'Com quem se faz algo, ou liga dois nomes: "e".' },
  also: { label: 'Também (も)', explain: 'No lugar de は ou を, diz "também".' },
  from: { label: 'De / desde (から)', explain: 'O ponto de partida, o começo do tempo ou o motivo.' },
  until: { label: 'Até (まで)', explain: 'O ponto final, em lugar ou em tempo.' },
  detail: { label: 'Detalhe', explain: 'Uma palavra solta que dá mais informação (agora, devagar, mais...), sem partícula.' },
  predicate: { label: 'Fim da frase', explain: 'O verbo, o adjetivo ou です: sempre no fim. É onde a frase "fecha" e onde vem か, se for pergunta.' },
};

const ROLE_OF_PARTICLE: Readonly<Record<string, BlockRole>> = {
  は: 'topic',
  が: 'subject',
  を: 'object',
  に: 'target',
  で: 'place',
  へ: 'direction',
  の: 'possessor',
  と: 'with',
  も: 'also',
  から: 'from',
  まで: 'until',
};

/** Partículas e finais que fecham a frase: ficam junto do último bloco. */
const FINAL = new Set(['か', 'ね', 'よ', 'わ', 'な']);

/** Auxiliares do fim da frase: vão junto da palavra de antes (みせて + ください, ほしい + です). */
const AUX = new Set(['です', 'でした', 'ですか', 'ですね', 'ください', 'ましょう', 'ませんか', 'ません', 'ない', 'だ']);

/** Um pedaço da frase, já classificado. */
export interface Piece {
  text: string;
  kind: 'word' | 'particle' | 'aux';
}

/** Classifica pedaços escritos como no "Palavra por palavra" (a palavra e a partícula separadas). */
export const piecesFromParts = (parts: readonly string[]): Piece[] =>
  parts
    .map((p) => p.replace(/\s/g, ''))
    .filter(Boolean)
    .map((text): Piece => ({
      text,
      kind: text in ROLE_OF_PARTICLE || FINAL.has(text) || ['より', 'や'].includes(text) ? 'particle' : AUX.has(text) ? 'aux' : 'word',
    }));

/** Classifica os pedaços que o léxico do app acha numa frase escrita (serve para qualquer frase do banco ou da gramática). */
export function piecesFromText(jp: string): Piece[] | null {
  const tokens = segment(jp.replace(/\s/g, ''));
  if (!tokens) return null;
  return (tokens as Token[])
    .filter((t) => t.entry.role !== 'punct')
    .map((t): Piece => ({ text: t.surface, kind: t.entry.role === 'particle' ? 'particle' : t.entry.role === 'aux' ? 'aux' : 'word' }));
}

/**
 * Corta a frase em blocos "palavra + partícula" e dá a cada um o seu papel. O último bloco é o fim da frase (verbo, adjetivo ou
 * です), com か e ね coladas. Um の seguido de outra partícula ("おおきい のは") é o の de "aquele que...", e fica na palavra.
 */
export function anatomize(pieces: readonly Piece[] | null): Block[] | null {
  if (!pieces || pieces.length === 0) return null;

  const blocks: { words: string; particles: string[]; ends: boolean }[] = [];
  const last = () => blocks[blocks.length - 1];
  pieces.forEach((piece, index) => {
    if (piece.kind === 'word') {
      // Cada palavra abre o seu bloco: a partícula (se vier) fecha o bloco, e os auxiliares do fim ficam junto da última palavra.
      blocks.push({ words: piece.text, particles: [], ends: false });
    } else if (piece.kind === 'particle') {
      const open = last();
      if (!open) return;
      const next = pieces[index + 1];
      if (piece.text === 'の' && next?.kind === 'particle' && next.text !== 'の') open.words += piece.text;
      else if (FINAL.has(piece.text) && open.particles.length === 0 && index === pieces.length - 1) open.words += piece.text;
      else open.particles.push(piece.text);
    } else {
      const open = last();
      if (open && open.particles.length === 0) open.words += piece.text;
      else blocks.push({ words: piece.text, particles: [], ends: true });
    }
  });
  if (blocks.length === 0) return null;
  // Uma frase que termina numa partícula (こんばん + は) é uma saudação feita, não uma frase para desmontar.
  if ((last()?.particles.length ?? 0) > 0) return null;

  return blocks.map((b, i): Block => {
    const particle = b.particles[0] ?? null;
    const text = b.words + b.particles.join('');
    if (particle && ROLE_OF_PARTICLE[particle]) return { text, role: ROLE_OF_PARTICLE[particle], particle };
    if (i === blocks.length - 1) return { text, role: 'predicate', particle: null };
    return { text, role: 'detail', particle };
  });
}

/** Os blocos de uma frase de viagem, a partir do "Palavra por palavra" (sem depender do léxico). Null nas frases com duas versões. */
export function anatomizePhrase(phrase: { jp: string; breakdown: readonly { part: string }[] }): Block[] | null {
  if (phrase.jp.includes('/')) return null;
  return anatomize(piecesFromParts(phrase.breakdown.map((b) => b.part)));
}
