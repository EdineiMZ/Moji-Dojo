import { VOCAB } from '@/content';
it('dups', () => {
  const m = new Map<string, typeof VOCAB[number][]>();
  for (const w of VOCAB) m.set(w.meaning, [...(m.get(w.meaning) ?? []), w]);
  const lines = [...m.values()].filter((v) => v.length > 1).map((v) => v.map((w) => `${w.jp}(${w.reading};${w.group})`).join(' | '));
  console.log('\n' + lines.join('\n'));
  const twins = [...m.values()].filter((v) => v.length > 1 && new Set(v.map((w) => w.reading)).size === 1);
  console.log('mesmo significado e leitura:', twins.length);
});
