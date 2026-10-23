import { VOCAB, type VocabWord } from '@/content';
import { conjugate, type VerbForm } from '@/features/conjugation/conjugate';
import { VERBS } from '@/features/conjugation/verbs';

/**
 * O que um trecho do texto é para o banco de frases:
 * - word: palavra do vocabulário (ou uma forma conjugada dela);
 * - particle: partícula, gruda na palavra de antes;
 * - aux: final que gruda na palavra de antes (です, ない, ください...);
 * - punct: pontuação, que não conta.
 */
export type TokenRole = 'word' | 'particle' | 'aux' | 'punct';

export interface LexEntry {
  /** Id da palavra no vocabulário; null nas partículas, finais e nomes, que valem para qualquer aluno. */
  id: string | null;
  /** Como se lê (vazio na pontuação). */
  reading: string;
  role: TokenRole;
}

export type Lexicon = Map<string, LexEntry[]>;

const PARTICLES = [
  'は', 'が', 'を', 'に', 'へ', 'で', 'の', 'も', 'と', 'か', 'ね', 'よ', 'や', 'から', 'まで', 'より', 'ので', 'けど',
  'ほど', 'くらい', 'ぐらい', 'だけ', 'しか', 'ばかり', 'ずつ', 'など', 'って', 'わ', 'な', 'ながら', 'たり', 'し',
];

const AUX = [
  'です', 'でした', 'だ', 'だった', 'じゃ', 'ない', 'なかった', 'ありません', 'ありませんでした', 'でしょう', 'だろう',
  'ではありません', 'じゃありません', 'ください', 'でしょうか', 'ですか', 'ですよ', 'ですね', 'ましょう', 'ませんか',
];

/** Palavras de ligação e nomes que aparecem em todo lugar e não valem como "palavra nova". */
const FREE_WORDS = [
  'でも', 'そして', 'それから', 'しかし', 'だから', 'それで', 'もし', 'もう', 'まだ', 'とても', 'ちょっと', 'あまり',
  'よく', 'いつも', 'ここ', 'そこ', 'あそこ', 'どこ', 'これ', 'それ', 'あれ', 'どれ', 'この', 'その', 'あの', 'どの',
  'だれ', 'いつ', 'なに', 'なん', 'どう', 'どうして', 'なぜ', 'こう', 'そう', 'ああ', 'トム', 'メアリー', 'ジョン',
  'ボブ', 'ケン', 'アリス', 'ジェーン', 'ありがとう', 'すみません', 'ごめんなさい',
];

const PUNCT = ['。', '、', '！', '？', '!', '?', '「', '」', '『', '』', '…', '・', '，', '．', '　', ' ', '〜', '～'];

const isPlain = (s: string): boolean => s.length > 0 && !/[〜~()（）\s/]/u.test(s);

const add = (lex: Lexicon, surface: string, entry: LexEntry): void => {
  if (!isPlain(surface) && entry.role !== 'punct') return;
  const list = lex.get(surface);
  if (!list) lex.set(surface, [entry]);
  else if (!list.some((e) => e.id === entry.id && e.reading === entry.reading)) list.push(entry);
};

/** Formas de um verbo: [escrita, leitura] de cada uma (dicionário, ます, ない, て, た e as derivadas). */
function verbForms(word: VocabWord, spec: (typeof VERBS)[number]['spec']): [string, string][] {
  const forms: [string, string][] = [[word.jp, word.reading]];
  const both = (build: (text: string) => string[]): void => {
    const written = build(word.jp);
    const read = build(word.reading);
    written.forEach((w, i) => forms.push([w, read[i] as string]));
  };
  const form = (text: string, f: VerbForm): string => conjugate(text, spec, f);
  both((t) => {
    const masu = form(t, 'masu');
    const stem = masu.slice(0, -2);
    const nai = form(t, 'nai');
    const naiStem = nai.endsWith('ない') ? nai.slice(0, -2) : '';
    return [
      masu,
      stem,
      `${stem}ません`,
      `${stem}ました`,
      `${stem}ませんでした`,
      `${stem}ましょう`,
      `${stem}ませんか`,
      `${stem}たい`,
      `${stem}たくない`,
      `${stem}たかった`,
      `${stem}たくて`,
      nai,
      ...(naiStem ? [`${naiStem}なかった`, `${naiStem}なくて`] : []),
      form(t, 'te'),
      form(t, 'ta'),
    ];
  });
  return forms;
}

/** Formas de um adjetivo em い. */
function adjectiveForms(word: VocabWord): [string, string][] {
  const forms: [string, string][] = [[word.jp, word.reading]];
  const endings = ['くない', 'かった', 'くなかった', 'く', 'くて'];
  const irregular = word.reading === 'いい';
  const stemOf = (text: string): string => (irregular ? 'よ' : text.slice(0, -1));
  const written = irregular ? (word.jp === 'いい' ? 'よ' : '良') : stemOf(word.jp);
  const read = irregular ? 'よ' : stemOf(word.reading);
  for (const e of endings) forms.push([written + e, read + e]);
  if (irregular) forms.push(['良い', 'よい']);
  return forms;
}

let cached: Lexicon | null = null;

/** O léxico do banco: o vocabulário, os verbos e adjetivos conjugados, as partículas e a pontuação. */
export function getLexicon(): Lexicon {
  if (cached) return cached;
  const lex: Lexicon = new Map();
  const verbIds = new Set(VERBS.map((v) => v.word.id));

  // As partículas e os finais vêm primeiro: "は" sozinho é a partícula, não 歯, quando as duas leituras servem.
  for (const p of PARTICLES) add(lex, p, { id: null, reading: p, role: 'particle' });
  for (const a of AUX) add(lex, a, { id: null, reading: a, role: 'aux' });
  for (const w of FREE_WORDS) add(lex, w, { id: null, reading: w, role: 'word' });
  for (const p of PUNCT) add(lex, p, { id: null, reading: '', role: 'punct' });

  for (const word of VOCAB) {
    const entry: LexEntry = { id: word.id, reading: word.reading, role: 'word' };
    add(lex, word.jp, entry);
    add(lex, word.reading, entry);
  }
  for (const { word, spec } of VERBS) {
    for (const [surface, reading] of verbForms(word, spec)) {
      add(lex, surface, { id: word.id, reading, role: 'word' });
      add(lex, reading, { id: word.id, reading, role: 'word' });
    }
  }
  for (const word of VOCAB) {
    if (verbIds.has(word.id) || !word.jp.endsWith('い') || !word.reading.endsWith('い')) continue;
    for (const [surface, reading] of adjectiveForms(word)) {
      add(lex, surface, { id: word.id, reading, role: 'word' });
      add(lex, reading, { id: word.id, reading, role: 'word' });
    }
  }
  cached = lex;
  return lex;
}

export interface Token {
  surface: string;
  entry: LexEntry;
}

/**
 * Corta o texto em trechos do léxico, com o menor número de trechos. Devolve null se algum pedaço não está no léxico
 * (palavra fora do vocabulário, kanji que o app não ensina...).
 */
export function segment(text: string, lex: Lexicon = getLexicon()): Token[] | null {
  const chars = [...text];
  const n = chars.length;
  const MAX = 12;
  const best: number[] = Array<number>(n + 1).fill(Infinity);
  const back: ({ from: number; entry: LexEntry } | null)[] = Array<{ from: number; entry: LexEntry } | null>(n + 1).fill(null);
  best[0] = 0;
  for (let i = 0; i < n; i++) {
    if (!Number.isFinite(best[i])) continue;
    for (let len = 1; len <= Math.min(MAX, n - i); len++) {
      const entries = lex.get(chars.slice(i, i + len).join(''));
      if (!entries) continue;
      // Pontuação não conta como trecho, para não favorecer frases com menos pontuação.
      const cost = entries[0]?.role === 'punct' ? 0 : 1;
      if ((best[i] as number) + cost < (best[i + len] as number)) {
        best[i + len] = (best[i] as number) + cost;
        back[i + len] = { from: i, entry: entries[0] as LexEntry };
      }
    }
  }
  if (!Number.isFinite(best[n])) return null;
  const tokens: Token[] = [];
  for (let at = n; at > 0; ) {
    const step = back[at] as { from: number; entry: LexEntry };
    tokens.unshift({ surface: chars.slice(step.from, at).join(''), entry: step.entry });
    at = step.from;
  }
  return tokens;
}

/** A leitura em kana, com espaço entre as palavras e as partículas e finais coladas na palavra de antes. */
export function spacedReading(tokens: readonly Token[]): string {
  let out = '';
  let previous: Token | null = null;
  for (const token of tokens) {
    const { role, reading } = token.entry;
    if (role === 'punct') continue;
    const sticks =
      role === 'particle' ||
      role === 'aux' ||
      // "みて いる" vira "みています": a forma de 居る depois de uma forma em て/で fica junto.
      (token.entry.id === '居る' && previous !== null && /[てで]$/u.test(previous.entry.reading));
    if (out && !sticks) out += ' ';
    out += reading;
    previous = token;
  }
  return out;
}

/** Ids das palavras do vocabulário que o texto usa (sem repetir). */
export function wordsUsed(tokens: readonly Token[]): string[] {
  return [...new Set(tokens.flatMap((t) => (t.entry.id ? [t.entry.id] : [])))];
}

/**
 * Como `segment`, mas aceita trechos desconhecidos (cada letra fora do léxico custa mais que uma palavra): serve para contar
 * as palavras do vocabulário em textos de verdade, onde também há palavras que o app não ensina. Devolve só os trechos
 * reconhecidos.
 */
export function segmentLoose(text: string, lex: Lexicon = getLexicon()): Token[] {
  const chars = [...text];
  const n = chars.length;
  const MAX = 12;
  const UNKNOWN_COST = 4;
  const best: number[] = Array<number>(n + 1).fill(Infinity);
  const back: ({ from: number; entry: LexEntry | null } | null)[] = Array<{ from: number; entry: LexEntry | null } | null>(n + 1).fill(null);
  best[0] = 0;
  for (let i = 0; i < n; i++) {
    const here = best[i] as number;
    if (here + UNKNOWN_COST < (best[i + 1] as number)) {
      best[i + 1] = here + UNKNOWN_COST;
      back[i + 1] = { from: i, entry: null };
    }
    for (let len = 1; len <= Math.min(MAX, n - i); len++) {
      const entries = lex.get(chars.slice(i, i + len).join(''));
      if (!entries) continue;
      const cost = entries[0]?.role === 'punct' ? 0 : 1;
      if (here + cost < (best[i + len] as number)) {
        best[i + len] = here + cost;
        back[i + len] = { from: i, entry: entries[0] as LexEntry };
      }
    }
  }
  const tokens: Token[] = [];
  for (let at = n; at > 0; ) {
    const step = back[at] as { from: number; entry: LexEntry | null };
    if (step.entry) tokens.unshift({ surface: chars.slice(step.from, at).join(''), entry: step.entry });
    at = step.from;
  }
  return tokens;
}
