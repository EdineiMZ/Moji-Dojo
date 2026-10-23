import { SENTENCE_BANK, type BankSentence } from '@/content/sentenceBank';
import { findWord } from '@/content';
import { BANK_BATCH, bankCounts, pickSentences, rubyOf, sentencesFor, toExample, toTranslationItem, unknownWords } from './bank';

const sentence = (id: number, uses: string[], extra: Partial<BankSentence> = {}): BankSentence => ({
  id,
  jp: '私は学生です。',
  furi: '[私|わたし]は[学生|がく|せい]です。',
  kana: 'わたしは がくせいです',
  romaji: 'watashi wa gakusei desu',
  pt: 'Eu sou estudante.',
  uses,
  ...extra,
});

const bank = [sentence(1, []), sentence(2, ['私']), sentence(3, ['私', '学生']), sentence(4, ['私', '学生', '先生'])];
const known = new Set(['私']);

describe('filtros do banco', () => {
  it('só as que sei: nenhuma palavra fora do que foi aprendido', () => {
    expect(sentencesFor('known', known, bank).map((s) => s.id)).toEqual([1, 2]);
  });

  it('uma palavra nova: exatamente uma fora', () => {
    expect(sentencesFor('one', known, bank).map((s) => s.id)).toEqual([3]);
    expect(unknownWords(bank[2] as BankSentence, known)).toEqual(['学生']);
  });

  it('qualquer uma e as contagens', () => {
    expect(sentencesFor('any', known, bank)).toHaveLength(4);
    expect(bankCounts(known, bank)).toEqual({ known: 2, one: 1, any: 4 });
  });

  it('o sorteio evita as já mostradas enquanto houver outras', () => {
    const many = Array.from({ length: 30 }, (_, i) => sentence(i + 10, []));
    const first = pickSentences('known', new Set(), new Set(), Math.random, 10, many);
    const second = pickSentences('known', new Set(), new Set(first.map((s) => s.id)), Math.random, 10, many);
    expect(first).toHaveLength(10);
    expect(second.every((s) => !first.some((f) => f.id === s.id))).toBe(true);
    // Sem frases novas o bastante, repete em vez de ficar vazio.
    const few = pickSentences('known', new Set(), new Set(many.map((s) => s.id)), Math.random, 10, many);
    expect(few).toHaveLength(10);
  });
});

describe('formato da frase', () => {
  it('rubyOf separa texto e leitura', () => {
    expect(rubyOf('[私|わたし]は[学生|がく|せい]です。')).toEqual([
      { text: '私', reading: 'わたし' },
      { text: 'は' },
      { text: '学生', reading: 'がくせい' },
      { text: 'です。' },
    ]);
  });

  it('toExample traz kana, furigana quando há kanji, romaji e a fala sem espaços', () => {
    const e = toExample(sentence(1, []));
    expect(e).toMatchObject({ jp: 'わたしは がくせいです', romaji: 'watashi wa gakusei desu', pt: 'Eu sou estudante.', say: 'わたしはがくせいです' });
    expect(e.ruby?.length).toBe(4);
    expect(toExample(sentence(2, [], { jp: 'ありがとう。', furi: 'ありがとう。' })).ruby).toBeUndefined();
  });

  it('toTranslationItem aceita o kana e a escrita com kanji', () => {
    const item = toTranslationItem(sentence(1, []));
    expect(item.accepted).toEqual(['わたしは がくせいです', '私は学生です。']);
    expect(item.id).toBe('わたしはがくせいです');
  });
});

describe('o banco gerado', () => {
  it('tem frases, e cada uma tem leitura, tradução e só palavras que existem no vocabulário', () => {
    expect(SENTENCE_BANK.length).toBeGreaterThan(0);
    for (const s of SENTENCE_BANK) {
      expect({ id: s.id, ok: s.kana.length > 0 && s.pt.length > 0 && s.romaji.length > 0 }).toEqual({ id: s.id, ok: true });
      for (const id of s.uses) expect({ id: s.id, word: id, exists: findWord(id) !== undefined }).toEqual({ id: s.id, word: id, exists: true });
    }
  });

  it('não repete frase, e a leitura em kana só tem kana, espaços e a barra longa', () => {
    expect(new Set(SENTENCE_BANK.map((s) => s.id)).size).toBe(SENTENCE_BANK.length);
    for (const s of SENTENCE_BANK) expect({ id: s.id, kana: /^[ぁ-ゟァ-ヿー ]+$/.test(s.kana) }).toEqual({ id: s.id, kana: true });
  });

  it('o lote tem o tamanho esperado', () => {
    expect(BANK_BATCH).toBe(10);
  });
});
