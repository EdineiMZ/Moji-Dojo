// Gera src/content/grammarN5.ts a partir de scripts/grammar-n5/topics.mjs. Uso: npm run build-grammar
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { TOPICS } from './topics.mjs';

const require = createRequire(import.meta.url);
const { parseAnnotation } = require('./romaji.cjs');

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

const sources = TOPICS.flatMap((t) => t.examples.map((e) => e.id));

const text = `// Gerado por scripts/grammar-n5/build.mjs a partir de scripts/grammar-n5/topics.mjs. Não edite à mão.
// Exemplos: frases do Tatoeba (CC BY 2.0 FR), conferidas por scripts/grammar-n5/verify.mjs. Ver LICENSE.md.
import type { GrammarTopic } from '@/data/types';

export const GRAMMAR_N5: readonly GrammarTopic[] = ${JSON.stringify(topics, null, 2)};

/** Ids das frases do Tatoeba usadas nos exemplos (para o crédito). */
export const GRAMMAR_N5_SENTENCE_IDS: readonly number[] = ${JSON.stringify(sources)};
`;
writeFileSync(new URL('../../src/content/grammarN5.ts', import.meta.url), text);
console.log(`${topics.length} tópicos, ${sources.length} frases`);
