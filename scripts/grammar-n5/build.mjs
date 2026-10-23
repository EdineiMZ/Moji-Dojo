// Gera src/content/grammarN5.ts a partir de scripts/grammar-n5/topics.mjs. Uso: npm run build-grammar
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { TOPICS } from './topics.mjs';

const require = createRequire(import.meta.url);
const { parseAnnotation, plainKana } = require('./romaji.cjs');

/** "texto **negrito** e __japonês__" → corridas de texto. */
function runs(text) {
  const parts = [];
  const pattern = /\*\*(.+?)\*\*|__(.+?)__/g;
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index) });
    parts.push(m[1] !== undefined ? { text: m[1], bold: true } : { text: m[2], ja: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

function block(item) {
  if (typeof item === 'string') return { kind: 'p', runs: runs(item) };
  return {
    kind: 'table',
    rows: item.table.map((row) =>
      row.map((cell) => {
        const header = cell.startsWith('#');
        const cellRuns = runs(header ? cell.slice(1) : cell);
        // Uma célula tem um só trecho; se o texto tiver partes, usa o primeiro tipo e junta o texto.
        const text = cellRuns.map((r) => r.text).join('');
        const ja = cellRuns.some((r) => r.ja);
        return { text, ...(header ? { header: true } : {}), ...(ja && !header ? { ja: true } : {}) };
      }),
    ),
  };
}

const topics = TOPICS.map((t) => ({
  id: t.id,
  title: t.title,
  body: t.body.map(block),
  pattern: t.pattern,
  examples: t.examples.map((e) => {
    const { jp, romaji } = parseAnnotation(e.kana);
    return { jp, romaji, pt: e.pt };
  }),
}));

/** Blocos de um exemplo para o Montar: quebra nos espaços e antes de cada partícula ("|" fica junto). */
function tokensOf(kana) {
  const tokens = [];
  let current = '';
  const push = () => {
    if (current) tokens.push(current);
    current = '';
  };
  for (const c of kana) {
    if (c === ' ' || c === '~') push();
    else if (c !== '|') current += c;
  }
  push();
  return tokens;
}

const PARTICLES = new Set(['は', 'を', 'に', 'へ', 'で', 'の', 'も', 'と', 'が', 'から', 'まで', 'より']);
// Blocos a mais, de propósito: as trocas que mais se confundem com cada partícula.
const CONFUSABLE = {
  は: ['を', 'も', 'の'], を: ['に', 'は', 'で'], に: ['で', 'を', 'は'], へ: ['で', 'を', 'は'], で: ['に', 'を', 'は'],
  の: ['は', 'を', 'に'], も: ['は', 'を', 'に'], と: ['も', 'に', 'を'], が: ['に', 'で', 'の'],
  から: ['まで', 'に', 'で'], まで: ['から', 'に', 'で'], より: ['から', 'の', 'に'],
};
const GENERIC = ['を', 'に', 'で', 'は', 'の', 'も', 'と'];

/** Dois blocos a mais: não repetem os da resposta e não trocam に por へ (os dois servem para destino). */
function extrasFor(answer) {
  const blocked = new Set(answer);
  if (answer.includes('に') || answer.includes('へ')) {
    blocked.add('に');
    blocked.add('へ');
  }
  const candidates = [...answer.filter((t) => PARTICLES.has(t)).flatMap((t) => CONFUSABLE[t] ?? []), ...GENERIC];
  const extra = [];
  for (const c of candidates) {
    if (extra.length === 2) break;
    if (!blocked.has(c) && !extra.includes(c)) extra.push(c);
  }
  return extra;
}

const MIN_TOKENS = 3;
const MAX_TOKENS = 8;

const exercises = TOPICS.flatMap((t) =>
  t.examples.flatMap((e) => {
    const answer = tokensOf(e.kana);
    if (answer.length < MIN_TOKENS || answer.length > MAX_TOKENS) return [];
    if (answer.join('') !== plainKana(e.kana)) throw new Error(`blocos não fecham a frase ${e.id}`);
    const { romaji } = parseAnnotation(e.kana);
    return [{ topic: t.id, pt: e.pt, answer, extra: extrasFor(answer), romaji, hint: t.hint }];
  }),
);

const sources = TOPICS.flatMap((t) => t.examples.map((e) => e.id));

const text = `// Gerado por scripts/grammar-n5/build.mjs a partir de scripts/grammar-n5/topics.mjs. Não edite à mão.
// Exemplos: frases do Tatoeba (CC BY 2.0 FR), conferidas por scripts/grammar-n5/verify.mjs. Ver LICENSE.md.
import type { BuildExercise, GrammarTopic } from '@/data/types';

export const GRAMMAR_N5: readonly GrammarTopic[] = ${JSON.stringify(topics, null, 2)};

/** Exercícios do Montar e das Lacunas feitos com os exemplos acima (mesmo formato dos do protótipo). */
export const BUILD_N5: readonly BuildExercise[] = ${JSON.stringify(exercises, null, 2)};

/** Ids das frases do Tatoeba usadas nos exemplos (para o crédito). */
export const GRAMMAR_N5_SENTENCE_IDS: readonly number[] = ${JSON.stringify(sources)};
`;
writeFileSync(new URL('../../src/content/grammarN5.ts', import.meta.url), text);
console.log(`${topics.length} tópicos, ${sources.length} frases, ${exercises.length} exercícios`);
