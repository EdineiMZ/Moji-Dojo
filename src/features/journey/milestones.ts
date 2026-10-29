import { ALL_KANJI, kanjiLevelOf } from '@/content/kanji';
import { ALL_GRAMMAR } from '@/content/grammar';
import { levelOf, READINGS } from '@/content/readings';
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

const KANA = ALL_ITEMS.filter((i) => i.script === 'hira' || i.script === 'kata');
const N5_KANJI = ALL_KANJI.filter((k) => kanjiLevelOf(k) === 'N5').map((k) => k.char);
const N4_KANJI = ALL_KANJI.filter((k) => kanjiLevelOf(k) === 'N4').map((k) => k.char);

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

/** Os tópicos de gramática do N4 têm o prefixo "n4-" no id. */
const N4_TOPICS = ALL_GRAMMAR.filter((t) => t.id.startsWith('n4-'));
const N5_TOPICS = ALL_GRAMMAR.filter((t) => !t.id.startsWith('n4-'));

const firm = (srs: SrsState, chars: readonly string[]): number => chars.filter((c) => (srs[c]?.b ?? 0) >= FIRM_BOX).length;

/** O caminho N5 → N4 em marcos que o aluno enxerga: quantos kana, palavras e kanji já estão firmes (caixa 3 ou mais). */
const N5_READINGS = READINGS.filter((t) => levelOf(t) === 'N5');
const N4_READINGS = READINGS.filter((t) => levelOf(t) === 'N4');

export function levelPaths(srs: SrsState, vocab: SrsState, conj: SrsState = {}, mastered: Readonly<Record<string, number>> = {}, reads: Readonly<Record<string, number>> = {}): LevelPath[] {
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
        { id: 'grammar', label: 'Tópicos de gramática dominados (teste)', have: N5_TOPICS.filter((t) => mastered[t.id] !== undefined).length, goal: N5_TOPICS.length },
        { id: 'kanji5', label: 'Kanji do N5 firmes', have: firm(srs, N5_KANJI), goal: N5_KANJI.length },
        { id: 'reading5', label: 'Textos de leitura do N5 lidos', have: N5_READINGS.filter((t) => reads[t.id] !== undefined).length, goal: N5_READINGS.length },
      ],
    },
    {
      level: 'N4',
      title: 'Nível N4',
      milestones: [
        { id: 'words4', label: 'Palavras do N4 aprendidas', have: words.n4, goal: N4_WORD_TOTAL },
        { id: 'grammar4', label: 'Tópicos de gramática do N4 dominados (teste)', have: N4_TOPICS.filter((t) => mastered[t.id] !== undefined).length, goal: N4_TOPICS.length },
        { id: 'kanji4', label: 'Kanji do N4 firmes', have: firm(srs, N4_KANJI), goal: n4Total },
        { id: 'reading4', label: 'Textos de leitura do N4 lidos', have: N4_READINGS.filter((t) => reads[t.id] !== undefined).length, goal: N4_READINGS.length },
      ],
    },
  ];
}
