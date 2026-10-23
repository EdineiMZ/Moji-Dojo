import { VOCAB, type VocabWord } from '@/content';
import { WORD_FREQUENCY } from '@/content/frequency';

/** Em que ordem aparecem as palavras novas: a das lições do livro (a lista N5) ou as mais usadas primeiro. */
export type StudyOrder = 'book' | 'useful';

export const STUDY_ORDERS: readonly { value: StudyOrder; label: string }[] = [
  { value: 'book', label: 'Ordem do livro' },
  { value: 'useful', label: 'Mais usadas primeiro' },
];

export interface Situation {
  id: string;
  label: string;
  /** Ids das palavras do vocabulário que mais servem na situação, escolhidas à mão entre as que o app já ensina. */
  words: readonly string[];
}

/**
 * Situações de viagem. As palavras são do vocabulário N5 do app (nada de japonês novo): só a escolha de quais servem em cada
 * situação é uma curadoria feita para este app. Um teste confere que todas existem.
 */
export const SITUATIONS: readonly Situation[] = [
  {
    id: 'basico',
    label: 'Apresentação e básico',
    words: [
      '私', 'あなた', '名前', '日本', '日本人', '外国人', '友達', '学生', '先生', '仕事', '家族', '英語', '日本語', 'ブラジル', '家',
      '今日', '明日', '昨日', '何', '誰', 'どこ', 'いつ', '好き', 'ありがとう', 'おはよう', 'こんにちは', 'はい', 'いいえ', 'ええ',
      'どうも', '大丈夫', '分かる', '言う', '話す', '聞く', '住む', '来る', '行く', '勉強', '元気', '少し', 'ゆっくりと',
    ],
  },
  {
    id: 'restaurante',
    label: 'Restaurante',
    words: [
      '食べ物', '飲み物', '食べる', '飲む', '水', 'お茶', '紅茶', '牛乳', 'お酒', 'ビール', 'コーヒー', 'ジュース', 'ワイン', '魚',
      '肉', '野菜', '卵', '鶏肉', '豚肉', '牛肉', '御飯', '朝御飯', '昼御飯', '晩御飯', 'ラーメン', 'パン', 'スープ', 'ピザ',
      'ハンバーガー', 'カレー', 'デザート', '果物', '塩', '砂糖', '箸', 'フォーク', 'スプーン', 'ナイフ', 'コップ', 'お皿', '茶碗',
      '店', 'レストラン', '食堂', '喫茶店', 'お弁当', '料理', '美味しい', '辛い', '甘い', '冷たい', '熱い', 'まずい', '一人', '二人',
      '円', 'お金', '下さい', 'いくら', '一つ', '二つ', '三つ', 'お腹',
    ],
  },
  {
    id: 'compras',
    label: 'Compras',
    words: [
      '買う', '買い物', '売る', '店', 'お店', 'デパート', '八百屋', 'いくら', '円', 'お金', '財布', '高い', '安い', '大きい', '小さい',
      '服', '洋服', 'シャツ', 'ワイシャツ', 'スカート', 'ズボン', 'セーター', 'コート', '靴', '靴下', '帽子', '眼鏡', 'かばん', '傘',
      '時計', '色', '赤', '青', '白', '黒', '緑', '黄色', '茶色', '欲しい', '少し', 'もっと', '全部', '一つ', '二つ', '下さい', '見る',
      '本', '写真', 'カメラ', '個', '枚', '番号', '大きな', '小さな',
    ],
  },
  {
    id: 'transporte',
    label: 'Transporte',
    words: [
      '駅', '電車', '地下鉄', 'バス', 'タクシー', '飛行機', '自転車', '自動車', '車', '切符', '道', '交差点', '空港', '地図', '右', '左',
      'まっすぐ', '前', '後ろ', '北', '南', '東', '西', '近く', '遠い', '近い', '乗る', '降りる', '行く', '来る', '着く', '待つ', '出口',
      '入口', '階段', '番', '次', '時間', '何時', '半', '午前', '午後', '旅行', '荷物', '町', '公園', '銀行', '郵便局', '交番', '東京',
      '東京駅', '歩く', '走る', '止まる', '曲る', '横', 'そば', '向こう',
    ],
  },
  {
    id: 'hotel',
    label: 'Hotel',
    words: [
      'ホテル', '部屋', '荷物', '鍵', 'ベッド', 'シャワー', 'お風呂', 'トイレ', 'お手洗い', '電話', '番号', '窓', '戸', 'ドア',
      'エレベーター', '階', '階段', '朝御飯', '玄関', '廊下', '電気', '時計', '何時', '時間', '今晩', '一人', '二人', '休み', '朝',
      '夜', 'お金', '円', '洗濯', '石鹸', '紙', 'テレビ', 'パソコン', 'チェック', '開ける', '閉める', '開く', '閉まる', '起きる',
      '寝る', '帰る', '使う', '借りる', '貸す', 'タクシー', '空港', '今朝', '明日', '毎朝',
    ],
  },
  {
    id: 'ajuda',
    label: 'Ajuda e saúde',
    words: [
      '病院', '薬', '病気', '風邪', '痛い', '頭', 'お腹', '歯', '足', '目', '耳', '鼻', '口', '体', '医者', '警官', 'おまわりさん',
      '交番', '電話', 'トイレ', 'お手洗い', '道', '地図', '困る', '分かる', '教える', '呼ぶ', '大丈夫', '危ない', '悪い', '元気',
      '大使館', '銀行', '空港', '駅', '名前', '番号', '日本語', '英語', 'ゆっくりと', '質問', '友達', '手', '声',
    ],
  },
];

const VOCAB_IDS: ReadonlySet<string> = new Set(VOCAB.map((w) => w.id));

/** Ids das palavras de uma situação que existem no vocabulário. */
export function situationWordIds(situationId: string): ReadonlySet<string> {
  const situation = SITUATIONS.find((s) => s.id === situationId);
  return new Set((situation?.words ?? []).filter((id) => VOCAB_IDS.has(id)));
}

/** Quantas frases do Tatoeba usam a palavra (0 se nenhuma); serve para ordenar por uso. */
export const usageOf = (word: Pick<VocabWord, 'id'>): number => WORD_FREQUENCY[word.id] ?? 0;

/**
 * Ordena as palavras. "Do livro" mantém a ordem recebida. "Mais usadas" põe primeiro as palavras que aparecem em mais frases
 * do Tatoeba; empates e palavras sem registro mantêm a ordem do livro.
 */
export function sortWords<T extends Pick<VocabWord, 'id'>>(words: readonly T[], order: StudyOrder): T[] {
  if (order === 'book') return [...words];
  return words
    .map((word, index) => ({ word, index }))
    .sort((a, b) => usageOf(b.word) - usageOf(a.word) || a.index - b.index)
    .map((x) => x.word);
}
