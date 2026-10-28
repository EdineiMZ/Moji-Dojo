// Confere, no Tatoeba, que cada exemplo de gramática é a frase original: o id existe, o texto é o mesmo, a
// leitura em kana bate com a nossa escrita e a tradução em português é uma das do Tatoeba. Precisa de internet.
// Uso: npm run verify-grammar
import { createRequire } from 'node:module';
const { TOPICS } = await import(process.argv[2] === 'n4' ? '../grammar-n4/topics.mjs' : './topics.mjs');
import { search, sentenceById } from './tatoeba.mjs';

const require = createRequire(import.meta.url);
const { plainKana, stripPunctuation } = require('./romaji.cjs');

let problems = 0;
const report = (topic, example, message) => {
  problems++;
  console.log(`✗ ${topic.id} #${example.id}: ${message}`);
};

for (const topic of TOPICS) {
  for (const example of topic.examples) {
    const json = await search(example.ja, 1);
    // A busca por texto nem sempre traz a frase (sobretudo as longas): nesse caso, confere pelo id.
    const found = json.results.find((r) => r.id === example.id) ?? (await sentenceById(example.id));
    if (!found) {
      report(topic, example, `não achei a frase "${example.ja}" no Tatoeba`);
      continue;
    }
    if (found.license !== 'CC BY 2.0 FR') report(topic, example, `licença ${found.license}`);
    if (found.text !== example.ja) report(topic, example, `texto diferente: "${found.text}"`);

    const hrkt = found.transcriptions.find((t) => t.script === 'Hrkt');
    const reading = stripPunctuation((hrkt ? hrkt.text : found.text).replace(/\[([^\]]+)\]/g, (_, inner) => inner.split('|').slice(1).join('')));
    const ours = stripPunctuation(plainKana(example.kana));
    if (reading !== ours) report(topic, example, `leitura diferente: Tatoeba "${reading}", nossa "${ours}"`);

    if (example.furi && hrkt?.text !== example.furi) report(topic, example, `furigana diferente: Tatoeba "${hrkt?.text}", nossa "${example.furi}"`);

    const translations = found.translations.flat().filter((t) => t.lang === 'por').map((t) => t.text);
    const ptOk = translations.some((t) => t.replace(/[.!?]+$/, '') === example.pt.replace(/[.!?]+$/, ''));
    if (!ptOk) report(topic, example, `tradução "${example.pt}" não está entre: ${translations.join(' / ')}`);
  }
}

console.log(problems === 0 ? '✓ todos os exemplos conferem com o Tatoeba' : `${problems} problema(s)`);
process.exitCode = problems === 0 ? 0 : 1;
