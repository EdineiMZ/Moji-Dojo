import { ALL_ITEMS } from '@/features/catalog';
import { KANA_EXAMPLES, KANJI_EXAMPLES } from '@/data/examples';
import { KANA_MNEMONICS, KANJI_HINTS } from '@/data/hints';
import { wordsWithKanji } from '@/content';

it('audit3', () => {
  const out: string[] = [];
  for (const s of ['hira', 'kata', 'kanji']) {
    const items = ALL_ITEMS.filter((i) => i.script === s);
    const hm = (s === 'kanji' ? KANJI_HINTS : KANA_MNEMONICS) as Record<string, string>;
    const ex = (s === 'kanji' ? KANJI_EXAMPLES : KANA_EXAMPLES) as Record<string, unknown>;
    const noHint = items.filter((i) => !hm[i.char]);
    const noEx = items.filter((i) => !ex[i.char]);
    out.push(`${s}: ${items.length}; sem dica ${noHint.length}: ${noHint.filter((i) => ('group' in i ? i.group === 'base' : true)).slice(0, 40).map((i) => i.char).join('')}; sem exemplo ${noEx.length}`);
    if (s === 'kanji') {
      const noWords = items.filter((i) => wordsWithKanji(i.char).length === 0);
      out.push(`kanji sem nenhuma palavra do vocabulário ${noWords.length}: ${noWords.map((i) => i.char).join('')}`);
    }
  }
  console.log('\n' + out.join('\n'));
});
