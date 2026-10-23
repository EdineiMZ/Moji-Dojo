import { VOCAB, type VocabWord } from '@/content';
import type { VerbGroup, VerbSpec } from './conjugate';

/**
 * O tipo de cada verbo do vocabulário. Só os verbos listados aqui entram no treino; o significado e a
 * leitura vêm do vocabulário (src/content), e as formas saem das regras de `conjugate`.
 * Os verbos em る que parecem do grupo 2 mas são do grupo 1 (切る, 知る, 帰る...) estão em GODAN de propósito.
 */
const ICHIDAN = [
  '起きる', '寝る', '出かける', '着る', '疲れる', '見せる', '消える', '晴れる', '開ける', '上げる', '浴びる',
  '入れる', '生まれる', '教える', '覚える', '降りる', '借りる', '答える', '閉める', '締める', '食べる', 'つける',
  '勤める', 'できる', '出る', '並べる', '見る', '忘れる', '居る', 'かける', '掛ける',
] as const;

const GODAN = [
  '泳ぐ', '遊ぶ', '死ぬ', '立つ', '歌う', 'かぶる', '知る', 'はく', '洗う', '言う', '切る', '作る', '始まる',
  '弾く', 'かかる', 'なる', '取る', '習う', '働く', '磨く', '売る', '困る', '出す', '脱ぐ', '押す', '咲く',
  '頼む', '呼ぶ', '歩く', '置く', '貼る', 'やる', '走る', '吹く', '違う', '会う', '開く', '在る', '有る',
  '要る', '行く', '帰る', '書く', '返す', '貸す', '聞く', '曇る', '差す', '閉まる', '吸う', '住む', '座る',
  '使う', '着く', '買う', '止まる', '飛ぶ', '撮る', '鳴く', '無くす', '並ぶ', '登る', '飲む', '乗る', '入る',
  '話す', '引く', '降る', '曲る', '待つ', '持つ', '休む', '読む', '分かる', '渡す', '渡る', '終る', '消す',
] as const;

const SURU = ['する', 'コピーする'] as const;
const KURU = ['来る'] as const;

/** Verbos que fogem da regra do grupo 1. */
const IRREGULAR: Readonly<Record<string, NonNullable<VerbSpec['irregular']>>> = {
  行く: 'iku',
  在る: 'aru',
  有る: 'aru',
};

const GROUP_OF: ReadonlyMap<string, VerbGroup> = new Map<string, VerbGroup>([
  ...ICHIDAN.map((jp) => [jp, 'ichidan'] as const),
  ...GODAN.map((jp) => [jp, 'godan'] as const),
  ...SURU.map((jp) => [jp, 'suru'] as const),
  ...KURU.map((jp) => [jp, 'kuru'] as const),
]);

/** Um verbo do vocabulário e como ele se conjuga. */
export interface Verb {
  word: VocabWord;
  spec: VerbSpec;
}

/** Verbos treináveis, na ordem do vocabulário. */
export const VERBS: readonly Verb[] = VOCAB.flatMap((word): Verb[] => {
  const group = GROUP_OF.get(word.id);
  if (!group) return [];
  const irregular = IRREGULAR[word.id];
  return [{ word, spec: { jp: word.jp, group, ...(irregular ? { irregular } : {}) } }];
});

const VERB_BY_ID: ReadonlyMap<string, Verb> = new Map(VERBS.map((v) => [v.word.id, v]));

export const findVerb = (id: string): Verb | undefined => VERB_BY_ID.get(id);

export const GROUP_LABELS: Readonly<Record<VerbGroup, string>> = {
  godan: 'grupo 1',
  ichidan: 'grupo 2',
  suru: 'する',
  kuru: '来る',
};

/** Ids da lista que não existem no vocabulário (para o teste apontar). */
export const missingVerbIds = (): string[] => [...GROUP_OF.keys()].filter((id) => !VOCAB.some((w) => w.id === id));
