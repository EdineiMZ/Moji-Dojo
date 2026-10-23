// Conta quantas vezes cada palavra do vocabulário aparece nas frases japonesas do Tatoeba (CC BY 2.0 FR) e gera
// src/content/frequency.ts. Uso: FREQ_SENTENCES=<jpn_sentences.tsv> npm run build-frequency
import { VOCAB } from '@/content';
import { segmentLoose, wordsUsed } from '@/features/bank/lexicon';

const fs = require('node:fs') as {
  readFileSync(file: string, encoding: 'utf8'): string;
  writeFileSync(file: string, data: string): void;
};
const path = require('node:path') as { join(...parts: string[]): string };

const source = process.env.FREQ_SENTENCES;
const run = process.env.BUILD_FREQ === '1' && source ? describe : describe.skip;

run('frequência das palavras', () => {
  it('escreve src/content/frequency.ts', () => {
    const lines = fs.readFileSync(source as string, 'utf8').split('\n');
    const counts = new Map<string, number>();
    let used = 0;
    for (const line of lines) {
      const text = line.split('\t')[2];
      if (!text || [...text].length > 40) continue;
      used++;
      for (const id of wordsUsed(segmentLoose(text))) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    const ids = new Set(VOCAB.map((w) => w.id));
    const entries = [...counts.entries()].filter(([id]) => ids.has(id)).sort((a, b) => b[1] - a[1]);
    const body = entries.map(([id, n]) => `  ${JSON.stringify(id)}: ${n},`).join('\n');
    fs.writeFileSync(
      path.join(process.cwd(), 'src/content/frequency.ts'),
      `// Gerado por \`npm run build-frequency\` (scripts/frequency). Não edite à mão.
// Em quantas frases curtas do Tatoeba (https://tatoeba.org, CC BY 2.0 FR) cada palavra aparece. Serve para ordenar por uso.

/** Número de frases (de ${used}) em que a palavra aparece. Palavras que não aparecem não estão aqui. */
export const WORD_FREQUENCY: Readonly<Record<string, number>> = {
${body}
};

export const FREQUENCY_SAMPLE = ${used};
`,
    );
    console.log(`${entries.length} palavras contadas em ${used} frases`);
    expect(entries.length).toBeGreaterThan(300);
  });
});
