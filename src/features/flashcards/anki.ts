import { ALL_KANJI } from '@/content/kanji';
import { ALL_TRAVEL_PHRASES } from '@/content/travel';
import { VOCAB } from '@/content';
import type { MyPhrases } from '@/features/myphrases/phrases';
import type { SrsState } from '@/features/review/srs';
import { learnedWordIds } from '@/features/vocab/cards';
import { kanaToRomaji } from '@/lib/romaji';

export type AnkiSet = 'words-learned' | 'words-all' | 'kanji' | 'travel' | 'mine';

export const ANKI_SETS: readonly { id: AnkiSet; label: string; hint: string }[] = [
  { id: 'words-learned', label: 'Palavras que estudo', hint: 'As palavras que já entraram na sua revisão.' },
  { id: 'words-all', label: 'Todas as palavras', hint: 'O vocabulário N5 inteiro do app.' },
  { id: 'kanji', label: 'Kanji', hint: 'Significado e leituras (on e kun).' },
  { id: 'travel', label: 'Frases de viagem', hint: 'Frase em japonês, romaji e tradução.' },
  { id: 'mine', label: 'Minhas frases', hint: 'As frases que você guardou.' },
];

export interface AnkiRow {
  front: string;
  back: string;
  tags: string;
}

export interface AnkiSources {
  vocab: SrsState;
  myPhrases: MyPhrases;
}

/** Texto para o campo do Anki, que aceita HTML: escapa os símbolos e troca quebras de linha por <br>. */
export function ankiField(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\t/g, ' ')
    .replace(/\r?\n/g, '<br>');
}

const lines = (...parts: (string | undefined)[]): string => parts.filter((p): p is string => !!p).join('\n');

/** As linhas (frente, verso, etiqueta) de um conjunto de cartões. */
export function ankiRows(set: AnkiSet, sources: AnkiSources): AnkiRow[] {
  switch (set) {
    case 'words-learned':
    case 'words-all': {
      const learned = learnedWordIds(sources.vocab);
      const words = set === 'words-all' ? VOCAB : VOCAB.filter((w) => learned.has(w.id));
      return words.map((w) => ({
        front: w.jp,
        back: lines(w.reading !== w.jp ? w.reading : undefined, w.meaning, kanaToRomaji(w.reading)),
        tags: `MojiDojo::Palavras::${w.group.replace(/\s+/g, '_')}`,
      }));
    }
    case 'kanji':
      return ALL_KANJI.map((k) => ({
        front: k.char,
        back: lines(k.meaning, k.on.length > 0 ? `音: ${k.on.join('、')}` : undefined, k.kun.length > 0 ? `訓: ${k.kun.join('、')}` : undefined),
        tags: 'MojiDojo::Kanji',
      }));
    case 'travel':
      return ALL_TRAVEL_PHRASES.map((p) => ({
        front: p.jp,
        back: lines(p.romaji, p.pt),
        tags: `MojiDojo::Viagem::${p.category.replace(/\s+/g, '_')}`,
      }));
    case 'mine':
      return Object.values(sources.myPhrases).map((p) => ({ front: p.jp, back: p.pt, tags: 'MojiDojo::MinhasFrases' }));
  }
}

/**
 * O arquivo de importação do Anki: texto com tabulação, cabeçalhos que o Anki 2.1.54+ entende (separador, HTML e a coluna das
 * etiquetas) e uma linha por cartão. Cartões repetidos (mesma frente) entram uma vez só.
 */
export function toAnkiText(rows: readonly AnkiRow[]): string {
  const seen = new Set<string>();
  const body: string[] = [];
  for (const row of rows) {
    if (seen.has(row.front)) continue;
    seen.add(row.front);
    body.push(`${ankiField(row.front)}\t${ankiField(row.back)}\t${row.tags}`);
  }
  return ['#separator:tab', '#html:true', '#tags column:3', ...body].join('\n') + '\n';
}

/** Junta vários conjuntos num só arquivo. */
export function buildAnkiFile(sets: readonly AnkiSet[], sources: AnkiSources): { text: string; count: number } {
  const rows = sets.flatMap((set) => ankiRows(set, sources));
  const text = toAnkiText(rows);
  return { text, count: text.split('\n').filter((l) => l !== '' && !l.startsWith('#')).length };
}
