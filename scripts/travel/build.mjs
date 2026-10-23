// Gera src/content/travelExtra.ts a partir de scripts/travel/phrases.mjs. Uso: npm run build-travel
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { EXTRA } from './phrases.mjs';

const require = createRequire(import.meta.url);
const { parseAnnotation, plainKana } = require('../grammar-n5/romaji.cjs');

const seen = new Set();
const categories = EXTRA.map((category) => ({
  category: category.category,
  phrases: category.phrases.map((p) => {
    const { jp, romaji } = parseAnnotation(p.ja);
    if (seen.has(jp)) throw new Error(`frase repetida: ${jp}`);
    seen.add(jp);
    const breakdown = p.parts.split(';').map((piece) => {
      const [part, ...meaning] = piece.trim().split('=');
      if (!part || meaning.length === 0) throw new Error(`pedaço sem significado em "${jp}": ${piece}`);
      return { part: part.trim(), meaning: meaning.join('=').trim() };
    });
    // Os pedaços têm de fechar com a frase (sem contar espaços e as marcas de partícula).
    const joined = breakdown.map((b) => b.part).join('').replace(/ /g, '');
    if (joined !== plainKana(p.ja).replace(/ /g, '')) throw new Error(`os pedaços não fecham com a frase "${jp}": ${joined}`);
    return { jp, romaji, pt: p.pt, breakdown };
  }),
}));

const header = `// Gerado por \`npm run build-travel\` a partir de scripts/travel/phrases.mjs. Não edite à mão.
// Frases escritas para o app (uso corrente): precisam de revisão por quem fala japonês (ver src/content/LICENSE.md).
import type { TravelCategory } from '@/data/types';

`;
writeFileSync(
  new URL('../../src/content/travelExtra.ts', import.meta.url),
  `${header}export const TRAVEL_EXTRA: readonly TravelCategory[] = ${JSON.stringify(categories, null, 2)};\n`,
);
console.log(`${categories.length} categorias, ${seen.size} frases`);
