import { findItem } from '@/features/catalog';
import { answerQuestion, startQuiz, type Rng } from '@/features/quiz/quiz';
import { addConfusion, buildConfusedQuestions, confusedPairs, sanitizeConfusions } from './confusions';
import { buildReadQuestions, isReadable, knownKana, MIN_KNOWN_FOR_WORDS, readableWords, readableWordsByPriority, readingTip } from './readWords';
import { wordLevelOfGroup } from '@/content/vocab';

const seeded = (seed: number): Rng => {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
};

describe('confusões', () => {
  it('registra o que era e o que foi marcado; igual, escritas diferentes e não-kana são ignorados', () => {
    let c = addConfusion({}, 'さ', 'ち');
    c = addConfusion(c, 'さ', 'ち');
    expect(c).toEqual({ さ: { ち: 2 } });
    expect(addConfusion(c, 'さ', 'さ')).toBe(c);
    expect(addConfusion(c, 'さ', 'サ')).toBe(c);
    expect(addConfusion(c, '水', 'さ')).toBe(c);
  });

  it('junta os dois sentidos no mesmo par e ordena do mais confundido para o menos', () => {
    let c = addConfusion({}, 'さ', 'ち');
    c = addConfusion(c, 'ち', 'さ');
    for (let i = 0; i < 3; i++) c = addConfusion(c, 'き', 'さ');
    expect(confusedPairs(c)).toEqual([
      { a: 'き', b: 'さ', count: 3 },
      { a: 'さ', b: 'ち', count: 2 },
    ]);
    expect(confusedPairs(c, 1)).toHaveLength(1);
  });

  it('monta uma pergunta lado a lado por par, com os dois como alternativa', () => {
    const qs = buildConfusedQuestions([{ a: 'さ', b: 'ち', count: 2 }], seeded(1), 2);
    expect(qs).toHaveLength(2);
    expect(new Set(qs.map((q) => q.item.char))).toEqual(new Set(['さ', 'ち']));
    for (const q of qs) {
      expect(q.direction).toBe('r2k');
      expect(q.options.map((o) => o.char).sort()).toEqual(['さ', 'ち'].sort());
      expect(answerQuestion(startQuiz([q]), q.item.char, seeded(2)).correct).toBe(true);
    }
  });

  it('pares com o mesmo som (じ e ぢ) não viram pergunta', () => {
    expect(buildConfusedQuestions([{ a: 'じ', b: 'ぢ', count: 5 }], seeded(1))).toEqual([]);
  });

  it('a leitura do disco descarta lixo e contagens inválidas', () => {
    expect(sanitizeConfusions(null)).toEqual({});
    expect(sanitizeConfusions({ さ: { ち: 2.9, さ: 4, x: 1, き: -1, く: 'a' }, 水: { さ: 1 }, い: [] })).toEqual({ さ: { ち: 2 } });
  });
});

describe('palavras que dá para ler', () => {
  const hira = [...'あいうえおかきくけこさしすせそたちつてとなにぬねのまみむめも'];
  const known = new Set(hira);

  it('só entram palavras com kana conhecidos', () => {
    expect(isReadable('ねこ', known)).toBe(true);
    expect(isReadable('ねこ', new Set(['ね']))).toBe(false);
    expect(isReadable('', known)).toBe(false);
    expect(isReadable('はな', known)).toBe(false); // は não está na lista acima
  });

  it('ー, っ e きゃ seguem as regras próprias', () => {
    expect(isReadable('コー', new Set(['コ']))).toBe(true);
    expect(isReadable('かっき', new Set(['か', 'き', 'っ']))).toBe(true);
    expect(isReadable('かっき', new Set(['か', 'き', 'つ']))).toBe(false); // saber o つ não basta: falta a lição do っ
    expect(isReadable('きゃく', new Set(['きゃ', 'く']))).toBe(true);
    expect(isReadable('きゃく', new Set(['き', 'く']))).toBe(false);
  });

  it('sem kana suficientes não há palavras; com as primeiras linhas há, todas legíveis e só de kana', () => {
    expect(readableWords(new Set()).length).toBe(0);
    expect(readableWords(new Set(['あ'])).map((w) => w.jp)).toEqual(['ああ']);
    const words = readableWords(known);
    expect(words.length).toBeGreaterThan(5);
    for (const w of words) {
      expect(w.kanji).toHaveLength(0);
      expect(isReadable(w.jp, known)).toBe(true);
    }
    expect(hira.length).toBeGreaterThanOrEqual(MIN_KNOWN_FOR_WORDS);
  });

  it('as perguntas mostram a palavra e têm 4 significados diferentes, com a certa entre eles', () => {
    const qs = buildReadQuestions(known, seeded(7), 10);
    expect(qs.length).toBeGreaterThan(0);
    for (const q of qs) {
      expect(q.direction).toBe('k2r');
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options.map((o) => o.label)).size).toBe(4);
      expect(q.options).toContain(q.item);
      expect(isReadable(q.item.char, known)).toBe(true);
    }
    expect(buildReadQuestions(new Set(['あ']), seeded(1))).toEqual([]); // poucas palavras para 4 alternativas
  });

  it('cada palavra traz o romaji (para "Ver romaji") e a explicação depois da resposta o mostra', () => {
    const qs = buildReadQuestions(known, seeded(7), 10);
    for (const q of qs) {
      expect(q.item.script).toBe('pair');
      if (q.item.script !== 'pair') continue;
      expect(q.item.romaji).toMatch(/^[a-zāīūēō' -]+$/i);
      expect(q.item.explain).toContain(`(${q.item.romaji})`);
    }
  });

  it('knownKana ignora chaves que não são caracteres do app', () => {
    expect([...knownKana(['あ', 'xyz', 'ね'])].sort()).toEqual(['あ', 'ね'].sort());
    expect(findItem('あ')).toBeDefined();
  });
});

describe('kana pequenos só depois da lição que os ensina', () => {
  const srsKeys = [...'あいうえおかきくけこさしすせそたちつてとなにぬねの', 'きゃ', 'きゅ', 'きょ', 'しゃ'];

  it('sem a lição de Combinações 1, nem きゃ nem っ contam como conhecidos', () => {
    const known = knownKana(srsKeys, {});
    expect(known.has('きゃ')).toBe(false);
    expect(known.has('っ')).toBe(false);
    expect(known.has('つ')).toBe(true);
    // いっそ: い, そ e つ são conhecidos, mas o っ não
    expect(isReadable('いっそ', known)).toBe(false);
  });

  it('com a lição concluída, as combinações daquele grupo e o っ passam a contar', () => {
    const known = knownKana(srsKeys, { 'hira:L13': true });
    expect(known.has('きゃ')).toBe(true);
    expect(known.has('っ')).toBe(true);
    expect(isReadable('いっそ', known)).toBe(true);
    expect(known.has('ッ')).toBe(false); // o katakana tem a sua própria lição
  });

  it('só as combinações da lição concluída entram', () => {
    const known = knownKana([...srsKeys, 'じゃ'], { 'hira:L13': true });
    expect(known.has('しゃ')).toBe(true);
    expect(known.has('じゃ')).toBe(false); // lição Combinações 2 não feita
  });
});

describe('prioridade das palavras (nível JLPT e frequência)', () => {
  const known = knownKana(
    [...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'],
    { 'hira:L13': true },
  );

  it('N5 vem antes de N4 e N3, e dentro do nível as mais usadas vêm primeiro', () => {
    const words = readableWordsByPriority(known);
    const ranks = words.map((w) => ['N5', 'N4', 'N3', 'N2', 'N1'].indexOf(wordLevelOfGroup(w.group)));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(ranks[0]).toBe(0);
  });

  it('as perguntas saem do topo da lista: nenhuma é de um nível pior se há N5 de sobra', () => {
    const qs = buildReadQuestions(known, seeded(3), 10);
    const top = readableWordsByPriority(known).slice(0, 30).map((w) => w.jp);
    for (const q of qs) expect(top).toContain(q.item.char);
  });
});

describe('dica de leitura', () => {
  it('っ dobra a consoante, kana pequeno lê numa sílaba, ー alonga', () => {
    expect(readingTip('いっそ', 'isso')).toContain('dobra a consoante');
    expect(readingTip('きゃく', 'kyaku')).toContain('kya');
    expect(readingTip('コーヒー', 'koohii')).toContain('alonga');
    expect(readingTip('ねこ', 'neko')).toBeUndefined();
  });

  it('a explicação depois da resposta traz a dica só nas palavras que precisam dela', () => {
    const known = knownKana(
      [...'あいうえおかきくけこさしすせそたちつてとなにぬねの'],
      { 'hira:L13': true },
    );
    for (const q of buildReadQuestions(known, seeded(5), 30)) {
      if (q.item.script !== 'pair') continue;
      expect(q.item.explain?.includes('Dica:')).toBe(readingTip(q.item.char, q.item.romaji ?? '') !== undefined);
    }
  });
});
