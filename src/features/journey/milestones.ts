import { ALL_KANJI, ALL_KANJI_CATEGORIES } from '@/content/kanji';
import { ALL_GRAMMAR } from '@/content/grammar';
import { learnedVerbIds } from '@/features/conjugation/cards';
import { VERBS } from '@/features/conjugation/verbs';
import { ALL_ITEMS } from '@/features/catalog';
import { FIRM_BOX, type SrsState } from '@/features/review/srs';
import { VOCAB } from '@/content';
import { learnedWordIds } from '@/features/vocab/cards';
import { DISTINCT_WORDS, isSecondaryTwin, twinsOf } from '@/features/vocab/twins';

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

/** As palavras do N4 são as dos grupos "N4: ..."; as demais (inclusive os exemplos dos kana e dos kanji) contam no N5. */
const N4_WORD_IDS: ReadonlySet<string> = new Set(VOCAB.filter((w) => w.group.startsWith('N4:')).map((w) => w.id));
const N4_WORD_TOTAL = VOCAB.filter((w) => N4_WORD_IDS.has(w.id) && !isSecondaryTwin(w.id)).length;

/** Palavras aprendidas, separadas por nível (cada grupo de gêmeas conta uma vez). */
export function learnedWordsByLevel(vocab: SrsState): { n5: number; n4: number } {
  const distinct = new Set([...learnedWordIds(vocab)].map((id) => twinsOf(id)[0]?.id ?? id));
  let n4 = 0;
  for (const id of distinct) if (N4_WORD_IDS.has(id)) n4++;
  return { n5: distinct.size - n4, n4 };
}

const firm = (srs: SrsState, chars: readonly string[]): number => chars.filter((c) => (srs[c]?.b ?? 0) >= FIRM_BOX).length;

/** O caminho N5 → N4 em marcos que o aluno enxerga: quantos kana, palavras e kanji já estão firmes (caixa 3 ou mais). */
export function levelPaths(srs: SrsState, vocab: SrsState, conj: SrsState = {}, mastered: Readonly<Record<string, number>> = {}): LevelPath[] {
  const words = learnedWordsByLevel(vocab);
  const n4Total = N4_KANJI.length;
  return [
    {
      level: 'N5',
      title: 'Nível N5',
      milestones: [
        { id: 'kana', label: 'Hiragana e katakana firmes', have: firm(srs, KANA.map((i) => i.char)), goal: KANA.length },
        { id: 'words', label: 'Palavras do vocabulário aprendidas', have: words.n5, goal: DISTINCT_WORDS - N4_WORD_TOTAL },
        { id: 'verbs', label: 'Verbos com a conjugação em estudo', have: learnedVerbIds(conj).size, goal: VERBS.length },
        { id: 'grammar', label: 'Tópicos de gramática dominados (teste)', have: ALL_GRAMMAR.filter((t) => mastered[t.id] !== undefined).length, goal: ALL_GRAMMAR.length },
        { id: 'kanji5', label: 'Kanji do N5 firmes', have: firm(srs, N5_KANJI), goal: N5_KANJI.length },
      ],
    },
    {
      level: 'N4',
      title: 'Nível N4',
      milestones: [
        { id: 'words4', label: 'Palavras do N4 aprendidas', have: words.n4, goal: N4_WORD_TOTAL },
        { id: 'kanji4', label: 'Kanji do N4 firmes', have: firm(srs, N4_KANJI), goal: n4Total },
      ],
    },
  ];
}
