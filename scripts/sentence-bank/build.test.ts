// Gera src/content/sentenceBank.ts a partir de scripts/sentence-bank/candidates.json, ficando só com as frases que o
// léxico do app cobre por inteiro e cuja leitura confere com a do Tatoeba. Uso: npm run build-sentences
import { segment, spacedReading, wordsUsed, type Token } from '@/features/bank/lexicon';

// Roda em Node, mas o projeto só carrega os tipos do Jest: declaramos só o que usamos.
const { kanaToRomaji } = require('../grammar-n5/romaji.cjs') as typeof import('../grammar-n5/romaji');

interface Candidate {
  id: number;
  text: string;
  hrkt: string;
  pt: string;
}

// Roda em Node, mas o projeto só carrega os tipos do Jest: declaramos só o que usamos.
const fs = require('node:fs') as {
  existsSync(file: string): boolean;
  readFileSync(file: string, encoding: 'utf8'): string;
  writeFileSync(file: string, data: string): void;
};
const path = require('node:path') as { join(...parts: string[]): string };

const root = process.cwd();
const source = path.join(root, 'scripts/sentence-bank/candidates.json');
const target = path.join(root, 'src/content/sentenceBank.ts');

const PUNCTUATION = /[\s。、！？!?.,「」『』…・〜~，．　]/g;
const readingOf = (hrkt: string): string => hrkt.replace(/\[([^\]]+)\]/g, (_, inner: string) => inner.split('|').slice(1).join(''));

/** Romaji palavra por palavra: partículas e finais separados (watashi wa gakusei desu), は/へ/を lidos como wa/e/o. */
const romajiOf = (tokens: readonly Token[]): string =>
  tokens
    .filter((t) => t.entry.role !== 'punct')
    .map((t) => kanaToRomaji(t.entry.reading, { particle: t.entry.role === 'particle' }))
    .join(' ');

const run = process.env.BUILD_BANK === '1' ? describe : describe.skip;

run('gera o banco de frases', () => {
  it('escreve src/content/sentenceBank.ts', () => {
    expect(fs.existsSync(source)).toBe(true);
    const { sentences } = JSON.parse(fs.readFileSync(source, 'utf8')) as { sentences: Record<string, Candidate> };
    const kept: { id: number; jp: string; furi: string; kana: string; romaji: string; pt: string; uses: string[] }[] = [];
    let mismatched = 0;
    for (const c of Object.values(sentences)) {
      const tokens = segment(c.text);
      if (!tokens) continue;
      const kana = spacedReading(tokens);
      if (kana.replace(PUNCTUATION, '') !== readingOf(c.hrkt).replace(PUNCTUATION, '')) {
        mismatched++;
        continue;
      }
      // Frases de uma palavra só ou longas demais não ajudam a treinar.
      if (c.pt.length > 120 || tokens.filter((t) => t.entry.role !== 'punct').length < 2 || kana.replace(/ /g, '').length < 4) continue;
      kept.push({ id: c.id, jp: c.text, furi: c.hrkt, kana, romaji: romajiOf(tokens), pt: c.pt, uses: wordsUsed(tokens) });
    }
    kept.sort((a, b) => a.uses.length - b.uses.length || [...a.jp].length - [...b.jp].length || a.id - b.id);
    const body = kept.map((s) => `  ${JSON.stringify(s)},`).join('\n');
    fs.writeFileSync(
      target,
      `// Gerado por \`npm run build-sentences\` (scripts/sentence-bank). Não edite à mão.\n` +
        `// Frases do Tatoeba (https://tatoeba.org), licença CC BY 2.0 FR; ver src/content/LICENSE.md.\n\n` +
        `/** Uma frase do banco: japonês com kanji, leitura com furigana, leitura em kana com espaços, romaji, tradução e as palavras do vocabulário que ela usa. */\n` +
        `export interface BankSentence {\n  id: number;\n  jp: string;\n  furi: string;\n  kana: string;\n  romaji: string;\n  pt: string;\n  uses: readonly string[];\n}\n\n` +
        `export const SENTENCE_BANK: readonly BankSentence[] = [\n${body}\n];\n`,
    );
    console.log(`${kept.length} frases de ${Object.keys(sentences).length} candidatas (${mismatched} com leitura diferente)`);
    expect(kept.length).toBeGreaterThan(0);
  });
});
