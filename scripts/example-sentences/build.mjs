// Gera assets/sentences.db: frases do Tatoeba (CC BY 2.0 FR) com tradução em português, no nível do app, com furigana e um índice
// de palavras para a tela "Explorar frases". Roda no computador; o app só lê o banco.
//
// Uso: node scripts/example-sentences/build.mjs <pasta com jpn_sentences.tsv, por_sentences.tsv, jpn-por_links.tsv, jmdict.gz e n4.csv>
//   --vocab arquivo.json  lista [{ jp, reading }] das palavras do app
//   [--unknown 1]  máximo de palavras fora do vocabulário (padrão 1)
//   [--cap 30000]  número máximo de frases no banco (as sem palavra nova e mais curtas vêm primeiro)
//   [--max 40]     tamanho máximo da frase, em caracteres (padrão 32)
//
// Precisa do `kuromoji` (tokenizador japonês, só no computador): npm i kuromoji numa pasta fora do projeto e KUROMOJI_DIR apontando para ela.
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { gunzipSync } from 'node:zlib';

// KUROMOJI_DIR = pasta que contém node_modules/kuromoji (fica fora do projeto: só o computador precisa dele)
const kuromojiRequire = createRequire(join(process.env.KUROMOJI_DIR ?? process.cwd(), 'x.js'));
const kuromoji = kuromojiRequire('kuromoji');

const args = process.argv.slice(2);
const DL = args[0];
if (!DL) throw new Error('Passe a pasta com os dados baixados');
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i < 0 ? fallback : Number(args[i + 1]);
};
const MAX_UNKNOWN = flag('--unknown', 1);
const MAX_LENGTH = flag('--max', 32);
const CAP = flag('--cap', 30000);

// --- vocabulário do app: [{ jp, reading }] numa lista JSON (--vocab arquivo.json)
const vocabArg = args.indexOf('--vocab');
if (vocabArg < 0) throw new Error('Passe --vocab <arquivo.json>');
const appVocab = JSON.parse(readFileSync(args[vocabArg + 1], 'utf8'));

const toHira = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const known = new Set();
for (const w of appVocab) {
  known.add(w.jp);
  known.add(toHira(w.reading));
}
// N4 (open-anki-jlpt-decks, MIT): expression,reading,...
for (const line of readFileSync(join(DL, 'n4.csv'), 'utf8').split('\n').slice(1)) {
  const [expr, reading] = line.split(',');
  if (!expr) continue;
  const clean = expr.replace(/[～〜~]/g, '');
  if (clean) known.add(clean);
  if (reading) known.add(toHira(reading.replace(/[～〜~]/g, '')));
}

// --- JMdict: leitura de cada palavra (para a busca por kana de uma palavra com kanji)
const jmReading = new Map();
{
  const xml = gunzipSync(readFileSync(join(DL, 'jmdict.gz'))).toString('utf8');
  for (const e of xml.split('<entry>').slice(1)) {
    const reb = /<reb>(.*?)<\/reb>/.exec(e)?.[1];
    if (!reb) continue;
    for (const m of e.matchAll(/<keb>(.*?)<\/keb>/g)) if (!jmReading.has(m[1])) jmReading.set(m[1], reb);
  }
}

// --- frases e traduções
const readTsv = (file) => readFileSync(join(DL, file), 'utf8').split('\n').map((l) => l.replace(/\r$/, '').split('\t'));
const jpn = new Map(readTsv('jpn_sentences.tsv').filter((l) => l[2]).map(([id, , text]) => [id, text]));
const por = new Map(readTsv('por_sentences.tsv').filter((l) => l[2]).map(([id, , text]) => [id, text]));
// Traduções diretas jpn->por e, para o resto, pela ponte do inglês (jpn->eng->por): o Tatoeba liga as frases assim.
const direct = new Map();
for (const [a, b] of readTsv('jpn-por_links.tsv')) {
  if (!a || !b || !jpn.has(a) || !por.has(b)) continue;
  direct.set(a, [...(direct.get(a) ?? []), por.get(b)]);
}
const engToPor = new Map();
for (const [e, b] of readTsv('eng-por_links.tsv')) {
  if (!e || !b || !por.has(b)) continue;
  engToPor.set(e, [...(engToPor.get(e) ?? []), por.get(b)]);
}
const translations = new Map(direct);
for (const [a, e] of readTsv('jpn-eng_links.tsv')) {
  if (!a || !e || !jpn.has(a) || direct.has(a)) continue;
  const via = engToPor.get(e);
  if (via) translations.set(a, [...(translations.get(a) ?? []), ...via]);
}

// Frases que não servem num app de estudo: nomes próprios de pessoas, violência, sexo, palavrão e afins (japonês e português).
const BLOCK_JP = /殺|死|自殺|セックス|ちんこ|まんこ|強姦|レイプ|売春|麻薬|爆弾|テロ|戦争|拷問|馬鹿|バカ|くそ|クソ|ばか|アホ|嫌い|憎|酒に酔|酔っ|タバコ|煙草|宗教|神様|キリスト|イスラム|ユダヤ|ヒトラー|ナチ/;
const BLOCK_PT = /porra|merda|caralho|foda|foder|puta|buceta|cu\b|bosta|estupr|suic|mat(ar|ou|ei|e-)|morr(er|eu|i)\b|mort[eo]|assassin|sexo|nazi|hitler|deus\b|jesus|cristo|religi/i;

const tokenizer = await new Promise((resolve, reject) => {
  kuromoji.builder({ dicPath: join(kuromojiRequire.resolve('kuromoji/package.json'), '..', 'dict') }).build((err, t) => (err ? reject(err) : resolve(t)));
});

const FUNCTION_POS = new Set(['助詞', '助動詞', '記号', 'フィラー', '接続詞', '感動詞', '接頭詞']);
const ALWAYS_OK_DETAIL = new Set(['代名詞', '非自立', '数', '接尾', '副詞可能']);
const OK_ADVERBS = new Set(['とても', 'もう', 'まだ', 'よく', 'いつも', 'ちょっと', 'あまり', 'すぐ', 'ここ', 'そこ', 'どう', 'こう', 'そう', 'ああ', 'いつ', 'なぜ', 'どうして', 'たくさん', 'ゆっくり', 'また', 'もっと', 'とき', 'ぜんぜん', 'ずっと', 'たぶん']);
const OK_ADNOMINAL = new Set(['この', 'その', 'あの', 'どの', 'ある', 'いろいろ', 'おかしな', '大きな', '小さな']);

const hasKanji = (s) => /[一-鿿々]/.test(s);

/** "食べる" lido "たべる" -> [食|た]べる: só o miolo com kanji leva leitura. */
function rubyOf(surface, readingHira) {
  if (!hasKanji(surface)) return surface;
  let start = 0;
  while (start < surface.length - 1 && !hasKanji(surface[start]) && surface[start] === readingHira[start]) start++;
  let end = 0;
  while (end < surface.length - start - 1 && !hasKanji(surface[surface.length - 1 - end]) && surface[surface.length - 1 - end] === readingHira[readingHira.length - 1 - end]) end++;
  const head = surface.slice(0, start);
  const tail = surface.slice(surface.length - end);
  const middle = surface.slice(start, surface.length - end);
  const reading = readingHira.slice(start, readingHira.length - end);
  if (!middle || !reading) return surface;
  return `${head}[${middle}|${reading}]${tail}`;
}

function analyse(text) {
  const tokens = tokenizer.tokenize(text);
  const unknown = [];
  const keys = new Set();
  let furi = '';
  let kana = '';
  for (const t of tokens) {
    const surface = t.surface_form;
    const reading = t.reading && t.reading !== '*' ? toHira(t.reading) : surface;
    furi += rubyOf(surface, reading);
    if (t.pos === '記号') continue;
    // kana por palavras (o romaji do app lê os trechos soltos; auxiliares e partículas de ligação grudam na palavra anterior)
    const sticks = t.pos === '助動詞' || (t.pos === '助詞' && ['接続助詞', '終助詞', '副助詞/並立助詞/終助詞'].includes(t.pos_detail_1)) || t.pos_detail_1 === '非自立' || t.pos_detail_1 === '接尾';
    kana += (kana && !sticks ? ' ' : '') + (hasKanji(surface) ? toHira(reading) : surface);
    const basic = t.basic_form && t.basic_form !== '*' ? t.basic_form : surface;
    const isFunction = FUNCTION_POS.has(t.pos);
    // chaves de busca: a palavra no jeito do dicionário, como está na frase e as leituras
    if (!isFunction && !(t.pos === '名詞' && ALWAYS_OK_DETAIL.has(t.pos_detail_1)) && t.pos !== '助動詞') {
      keys.add(basic);
      keys.add(surface);
      keys.add(reading);
      const dict = jmReading.get(basic);
      if (dict) keys.add(dict);
    }
    if (isFunction) continue;
    if (t.pos === '名詞' && t.pos_detail_1 === '固有名詞' && t.pos_detail_2 === '人名') return null;
    if (ALWAYS_OK_DETAIL.has(t.pos_detail_1) && t.pos !== '副詞' && t.pos !== '連体詞') continue;
    if (t.pos === '連体詞' && OK_ADNOMINAL.has(surface)) continue;
    if (t.pos === '副詞' && (OK_ADVERBS.has(surface) || OK_ADVERBS.has(basic))) continue;
    const base = basic;
    const dictReading = jmReading.get(base);
    const ok = known.has(base) || known.has(surface) || (dictReading && known.has(toHira(dictReading))) || known.has(reading);
    if (!ok) unknown.push(base);
  }
  return { furi, kana, unknown: [...new Set(unknown)], keys: [...keys].filter((k) => k && k.length <= 12) };
}

const candidates = [];
const seen = new Set();
for (const [id, text] of jpn) {
  const length = [...text].length;
  if (length < 4 || length > MAX_LENGTH) continue;
  // letras latinas e números ficam de fora: o tokenizador lê cada dígito separado ("１０時" virava "いち ぜろじ")
  if (/[A-Za-zＡ-Ｚａ-ｚ0-9０-９]/.test(text)) continue;
  if (BLOCK_JP.test(text)) continue;
  const options = translations.get(id);
  if (!options) continue;
  const pt = [...options].sort((a, b) => a.length - b.length)[0];
  if (BLOCK_PT.test(pt) || pt.length > 140) continue;
  if (seen.has(text)) continue;
  seen.add(text);
  candidates.push({ id: Number(id), text, pt });
}
console.log(`${candidates.length} frases curtas com tradução em português, sem os temas bloqueados`);

const kept = [];
let progress = 0;
for (const c of candidates) {
  const a = analyse(c.text);
  if (++progress % 5000 === 0) console.log(`${progress}/${candidates.length}`);
  if (!a || a.unknown.length > MAX_UNKNOWN || a.keys.length === 0) continue;
  kept.push({ ...c, ...a });
}
console.log(`${kept.length} frases no nível (até ${MAX_UNKNOWN} palavra fora do vocabulário)`);

const out = new URL('../../assets/sentences.db', import.meta.url);
mkdirSync(new URL('../../assets/', import.meta.url), { recursive: true });
if (existsSync(out)) rmSync(out);
const db = new DatabaseSync(out.pathname.replace(/^\/([A-Za-z]:)/, '$1'));
db.exec(`
  CREATE TABLE sentences (id INTEGER PRIMARY KEY, jp TEXT NOT NULL, furi TEXT NOT NULL, kana TEXT NOT NULL, pt TEXT NOT NULL, len INTEGER NOT NULL, unknown TEXT NOT NULL);
  CREATE TABLE words (key TEXT NOT NULL, sid INTEGER NOT NULL, PRIMARY KEY (key, sid)) WITHOUT ROWID;
`);
const insertSentence = db.prepare('INSERT INTO sentences VALUES (?, ?, ?, ?, ?, ?, ?)');
const insertWord = db.prepare('INSERT INTO words VALUES (?, ?)');
db.exec('BEGIN');
const chosen = kept.sort((a, b) => a.unknown.length - b.unknown.length || [...a.text].length - [...b.text].length).slice(0, CAP);
console.log(`${chosen.length} frases no banco`);
for (const s of chosen) {
  insertSentence.run(s.id, s.text, s.furi, s.kana, s.pt, [...s.text].length, JSON.stringify(s.unknown));
  for (const key of s.keys) insertWord.run(key, s.id);
}
db.exec('COMMIT');
db.exec('VACUUM');
db.close();
console.log('assets/sentences.db gerado');
