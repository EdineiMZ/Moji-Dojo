// Gera scripts/pos/words.json com todas as palavras do vocabulário do app (escrita, leitura e, nas do N5 e do N3, o significado
// em inglês da lista). É o passo 1 de `npm run build-pos`. Só roda com BUILD_POS=1.
import { VOCAB } from '@/content';
import { N3_WORDS } from '@/content/n3';
import { N5_WORDS } from '@/content/n5';

const fs = require('node:fs') as { writeFileSync(file: string, data: string): void };
const path = require('node:path') as { join(...parts: string[]): string };

const run = process.env.BUILD_POS === '1' ? describe : describe.skip;

run('lista de palavras para a classe gramatical', () => {
  it('escreve scripts/pos/words.json', () => {
    const en = new Map([...N5_WORDS, ...N3_WORDS].map((w) => [`${w.jp}|${w.reading}`, w.en]));
    const words = VOCAB.map((w) => ({ jp: w.jp, reading: w.reading, en: en.get(`${w.jp}|${w.reading}`) ?? '' }));
    fs.writeFileSync(path.join(process.cwd(), 'scripts/pos/words.json'), JSON.stringify(words));
    expect(words.length).toBe(VOCAB.length);
  });
});
