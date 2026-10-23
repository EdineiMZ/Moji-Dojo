// Kana → romaji (Hepburn, com macron nas vogais longas). É a mesma regra de scripts/grammar-n5/romaji.cjs (que gera o
// romaji dos exemplos de gramática); romaji.test.ts confere que as duas dão sempre o mesmo resultado.

const MONO: Record<string, string> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', ゐ: 'i', ゑ: 'e', を: 'o',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ゔ: 'vu',
};

// Sílabas de duas letras (a segunda é um kana pequeno). Vale para hiragana; o katakana vira hiragana antes.
const DIGRAPH: Record<string, string> = {
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo',
  しゃ: 'sha', しゅ: 'shu', しょ: 'sho', しぇ: 'she',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho', ちぇ: 'che',
  にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
  みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
  りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
  ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo', じぇ: 'je',
  びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
  ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo',
  てぃ: 'ti', でぃ: 'di', うぃ: 'wi', うぇ: 'we', うぉ: 'wo',
};

const MACRON: Record<string, string> = { a: 'ā', i: 'ī', u: 'ū', e: 'ē', o: 'ō' };
const PARTICLE: Record<string, string> = { は: 'wa', へ: 'e', を: 'o' };

/** Katakana → hiragana (o ー e o resto ficam como estão). */
const toHiragana = (text: string): string =>
  text.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

/** Alonga a última vogal do romaji (a → ā); se já for longa ou não houver vogal, não muda. */
function lengthen(romaji: string): string {
  const last = romaji.at(-1);
  return last && MACRON[last] ? romaji.slice(0, -1) + MACRON[last] : romaji;
}

/** Converte uma palavra em kana (hiragana ou katakana) para romaji. `particle` lê は como wa, へ como e, を como o. */
export function kanaToRomaji(kana: string, { particle = false }: { particle?: boolean } = {}): string {
  const chars = [...toHiragana(kana)];
  let out = '';
  let doubleNext = false;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i] as string;
    const pair = DIGRAPH[c + (chars[i + 1] ?? '')];
    let syllable: string;
    if (pair) {
      syllable = pair;
      i++;
    } else if (c === 'っ') {
      doubleNext = true;
      continue;
    } else if (c === 'ん') {
      const next = DIGRAPH[(chars[i + 1] ?? '') + (chars[i + 2] ?? '')] ?? MONO[chars[i + 1] ?? ''] ?? '';
      out += /^[aiueoy]/.test(next) ? "n'" : 'n';
      continue;
    } else if (c === 'ー') {
      out = lengthen(out);
      continue;
    } else if (particle && PARTICLE[c]) {
      syllable = PARTICLE[c];
    } else if (MONO[c]) {
      syllable = MONO[c];
    } else {
      // Pontuação ou algo que não é kana: passa direto.
      out += c;
      continue;
    }

    // Vogal longa: o + う/お, u + う, a + あ, e + え (e + い fica "ei", i + い fica "ii").
    const previousVowel = out.at(-1);
    const isLongVowel =
      (c === 'う' && (previousVowel === 'o' || previousVowel === 'u')) ||
      (c === 'お' && previousVowel === 'o') ||
      (c === 'あ' && previousVowel === 'a') ||
      (c === 'え' && previousVowel === 'e');
    if (isLongVowel && !doubleNext) {
      out = lengthen(out);
      continue;
    }

    if (doubleNext) {
      // っち → tchi; os outros dobram a consoante (っか → kka).
      syllable = syllable.startsWith('ch') ? 't' + syllable : syllable[0] + syllable;
      doubleNext = false;
    }
    out += syllable;
  }
  return out;
}
