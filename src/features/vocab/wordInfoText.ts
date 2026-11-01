import { VOCAB, type VocabWord } from '@/content';
import { WORD_EXTRAS, type WordExample } from '@/content/wordExtras';
import { sharesSense } from './senses';

/**
 * Como a palavra aparece na tela. Sufixos e prefixos levam o traço de ligação ("〜にくい", "マイ〜"): o da lista de
 * extras vale primeiro; sem ele, o "(sufixo)" ou "(prefixo)" do significado decide.
 */
export function displayOf(word: Pick<VocabWord, 'id' | 'jp' | 'meaning'>): string {
  const own = WORD_EXTRAS[word.id]?.display;
  if (own) return own;
  if (/\(sufixo[^)]*\)\s*$/iu.test(word.meaning)) return `〜${word.jp}`;
  if (/\(prefixo[^)]*\)\s*$/iu.test(word.meaning)) return `${word.jp}〜`;
  return word.jp;
}

export const exampleOf = (word: Pick<VocabWord, 'id'>): WordExample | undefined => WORD_EXTRAS[word.id]?.example;

const byReading = new Map<string, VocabWord[]>();
for (const w of VOCAB) byReading.set(w.reading, [...(byReading.get(w.reading) ?? []), w]);

/** Quantas outras palavras mostrar, no máximo, como "outros sentidos". */
const MAX_OTHERS = 4;

/**
 * Palavras que se leem igual mas são outra coisa (にくい: 憎い "odioso"). Não entram as formas da mesma palavra
 * (あさ / 朝), que dividem o sentido.
 */
export function otherSensesOf(word: VocabWord): VocabWord[] {
  return (byReading.get(word.reading) ?? []).filter((w) => w.id !== word.id && w.jp !== word.jp && !sharesSense(w, word)).slice(0, MAX_OTHERS);
}

/**
 * A explicação depois da resposta, completa: palavra (leitura) = significado, o exemplo de uso e os outros sentidos
 * dessa leitura. Devolve undefined quando não há nada além do básico (a tela usa o texto simples).
 */
export function explainWord(word: VocabWord): string | undefined {
  const example = exampleOf(word);
  const others = otherSensesOf(word);
  const shownName = displayOf(word);
  if (!example && others.length === 0 && shownName === word.jp) return undefined;
  const shown = word.reading !== word.jp ? `${shownName} (${word.reading})` : shownName;
  const parts = [`${shown} = ${word.meaning}`];
  if (example) {
    const reading = example.reading !== example.jp ? ` (${example.reading})` : '';
    parts.push(`Exemplo: ${example.jp}${reading} — ${example.pt}`);
  }
  if (others.length > 0) {
    parts.push(`Outros sentidos de ${word.reading}: ${others.map((w) => `${displayOf(w)}${w.reading !== w.jp ? ` (${w.reading})` : ''} = ${w.meaning}`).join(' · ')}`);
  }
  return parts.join('\n');
}
