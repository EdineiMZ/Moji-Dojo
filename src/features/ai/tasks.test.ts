import { createAiStore, MAX_DIARY } from './aiStore';
import { cleanGenerated, parseDiaryReview, parseExplanation, parseTextExplanation, parseGenerated, parsePhraseFix, PHRASE_TOPICS, unknownParts } from './tasks';

describe('parsePhraseFix', () => {
  it('aceita a correção completa e limita as listas', () => {
    const fix = parsePhraseFix({
      ok: false,
      corrected: 'わたしはぶらじるにすんでいます。',
      natural: '',
      explanation: 'Faltou a partícula に.',
      issues: [{ wrong: 'ぶらじる', right: 'ぶらじるに', why: 'Lugar onde mora usa に.' }, ...Array.from({ length: 6 }, () => ({ wrong: 'a', right: 'b', why: 'c' }))],
    });
    expect(fix?.ok).toBe(false);
    expect(fix?.issues).toHaveLength(4);
  });

  it('recusa respostas sem o essencial', () => {
    expect(parsePhraseFix(null)).toBeNull();
    expect(parsePhraseFix({ ok: 'sim', corrected: 'x', explanation: 'y' })).toBeNull();
    expect(parsePhraseFix({ ok: true, corrected: '', explanation: 'y' })).toBeNull();
    expect(parsePhraseFix({ ok: true, corrected: 'x', explanation: '' })).toBeNull();
  });

  it('descarta problemas sem explicação', () => {
    const fix = parsePhraseFix({ ok: true, corrected: 'x', explanation: 'y', issues: [{ wrong: 'a', right: 'b', why: '' }, 'texto', null] });
    expect(fix?.issues).toEqual([]);
  });
});

describe('parseExplanation', () => {
  it('exige o texto da explicação', () => {
    expect(parseExplanation({ explanation: 'Porque sim.', tip: 'Dica' })).toEqual({ explanation: 'Porque sim.', tip: 'Dica' });
    expect(parseExplanation({ explanation: '  ' })).toBeNull();
    expect(parseExplanation([])).toBeNull();
  });
});

describe('frases geradas', () => {
  it('deixa a frase pronta para o teclado de flick', () => {
    expect(cleanGenerated('わたしは コーヒーを のみます。', 'Eu bebo café.')).toEqual(expect.objectContaining({ jp: 'わたしはこーひーをのみます。', pt: 'Eu bebo café.' }));
  });

  it('recusa kanji, romaji, tamanho ruim e tradução vazia', () => {
    expect(cleanGenerated('私は学生です', 'Sou estudante.')).toBeNull();
    expect(cleanGenerated('watashi', 'x')).toBeNull();
    expect(cleanGenerated('あい', 'curta')).toBeNull();
    expect(cleanGenerated('あ'.repeat(31), 'longa')).toBeNull();
    expect(cleanGenerated('ありがとう', '')).toBeNull();
  });

  it('lê a lista, tira repetidas e inválidas, e falha se nada serve', () => {
    const parsed = parseGenerated({
      phrases: [
        { jp: 'おはようございます', pt: 'Bom dia.' },
        { jp: 'おはよう ございます', pt: 'repetida' },
        { jp: '日本語', pt: 'kanji' },
        { jp: 'ねこがすきです', pt: 'Gosto de gatos.' },
        { jp: 12, pt: 'x' },
      ],
    });
    expect(parsed?.map((p) => p.jp)).toEqual(['おはようございます', 'ねこがすきです']);
    expect(parseGenerated({ phrases: [{ jp: '日本', pt: 'x' }] })).toBeNull();
    expect(parseGenerated('texto')).toBeNull();
    expect(parseGenerated([{ jp: 'ありがとう', pt: 'Obrigado.' }])).toHaveLength(1);
  });

  it('avisa das partes que o vocabulário não cobre', () => {
    expect(unknownParts('わたしはがくせいです')).toEqual([]);
    const odd = unknownParts('ぬぬぬぬぬぬ');
    expect(odd.join('')).toBe('ぬぬぬぬぬぬ');
  });

  it('há temas para escolher', () => {
    expect(PHRASE_TOPICS.length).toBeGreaterThanOrEqual(5);
    expect(new Set(PHRASE_TOPICS.map((t) => t.value)).size).toBe(PHRASE_TOPICS.length);
  });
});

describe('parseTextExplanation', () => {
  it('lê tradução, palavras e gramática, descartando o que está incompleto', () => {
    const r = parseTextExplanation({
      translation: 'Vamos comer juntos.',
      reading: 'いっしょにたべましょう',
      words: [{ word: '食べる', reading: 'たべる', meaning: 'comer' }, { word: '', meaning: 'x' }, { word: '一緒', reading: 'いっしょ', meaning: '' }],
      grammar: [{ point: '〜ましょう', explanation: 'Convite.' }, { point: 'x', explanation: '' }],
      note: '',
    });
    expect(r?.words).toEqual([{ word: '食べる', reading: 'たべる', meaning: 'comer' }]);
    expect(r?.grammar).toHaveLength(1);
  });

  it('exige a tradução', () => {
    expect(parseTextExplanation({ translation: '' })).toBeNull();
    expect(parseTextExplanation('x')).toBeNull();
  });
});

describe('parseDiaryReview', () => {
  it('limita a 3 frases e recusa quando não há nenhuma corrigida', () => {
    const item = (n: number) => ({ original: `o${n}`, ok: n % 2 === 0, corrected: `c${n}`, pt: 'p', note: '' });
    const r = parseDiaryReview({ items: [1, 2, 3, 4, 5].map(item), summary: 'Muito bem!' });
    expect(r?.items).toHaveLength(3);
    expect(r?.items[1]?.ok).toBe(true);
    expect(parseDiaryReview({ items: [{ original: 'a', corrected: '' }] })).toBeNull();
    expect(parseDiaryReview({})).toBeNull();
  });
});

describe('diário guardado', () => {
  it('guarda os mais novos primeiro, até o limite, e sobrevive a reabrir', () => {
    const data = new Map<string, string>();
    const storage = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v), removeItem: (k: string) => void data.delete(k) };
    const store = createAiStore(storage);
    for (let i = 0; i < MAX_DIARY + 5; i++) store.getState().addDiary({ id: `d${i}`, at: i, items: [], summary: '' });
    expect(store.getState().diary).toHaveLength(MAX_DIARY);
    expect(store.getState().diary[0]?.id).toBe(`d${MAX_DIARY + 4}`);
    expect(createAiStore(storage).getState().diary).toHaveLength(MAX_DIARY);
    store.getState().clearAll();
    expect(store.getState().diary).toEqual([]);
  });
});
