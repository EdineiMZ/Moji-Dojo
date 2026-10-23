import { ALL_KANJI, ALL_KANJI_CATEGORIES } from '@/content/kanji';
import { VOCAB } from '@/content';
import { ALL_ITEMS } from '@/features/catalog';
import { FIRM_BOX, type SrsState } from '@/features/review/srs';
import { learnedWordIds } from '@/features/vocab/cards';

export interface Milestone {
  id: string;
  label: string;
  have: number;
  goal: number;
}

export interface LevelPath {
  level: 'N5' | 'N4';
  title: string;
  milestones: Milestone[];
}

const N4_GROUPS: ReadonlySet<string> = new Set(ALL_KANJI_CATEGORIES.filter((c) => c.label.startsWith('N4:')).map((c) => c.id));
const KANA = ALL_ITEMS.filter((i) => i.script === 'hira' || i.script === 'kata');
const N5_KANJI = ALL_KANJI.filter((k) => !N4_GROUPS.has(k.category)).map((k) => k.char);
const N4_KANJI = ALL_KANJI.filter((k) => N4_GROUPS.has(k.category)).map((k) => k.char);

const firm = (srs: SrsState, chars: readonly string[]): number => chars.filter((c) => (srs[c]?.b ?? 0) >= FIRM_BOX).length;

/** O caminho N5 → N4 em marcos que o aluno enxerga: quantos kana, palavras e kanji já estão firmes (caixa 3 ou mais). */
export function levelPaths(srs: SrsState, vocab: SrsState): LevelPath[] {
  const words = learnedWordIds(vocab).size;
  const n4Total = N4_KANJI.length;
  return [
    {
      level: 'N5',
      title: 'Nível N5',
      milestones: [
        { id: 'kana', label: 'Hiragana e katakana firmes', have: firm(srs, KANA.map((i) => i.char)), goal: KANA.length },
        { id: 'words', label: 'Palavras do vocabulário aprendidas', have: words, goal: VOCAB.length },
        { id: 'kanji5', label: 'Kanji do N5 firmes', have: firm(srs, N5_KANJI), goal: N5_KANJI.length },
      ],
    },
    {
      level: 'N4',
      title: 'Nível N4',
      milestones: [{ id: 'kanji4', label: 'Kanji do N4 firmes', have: firm(srs, N4_KANJI), goal: n4Total }],
    },
  ];
}
