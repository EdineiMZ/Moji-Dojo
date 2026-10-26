import { findLeeches } from '@/features/leeches/leeches';
import { createAiStore, MAX_STORIES } from './aiStore';
import { knownShare, parseMeaning, parseMnemonic, parseRegisters, parseStory } from './tasksMore';

describe('parseMnemonic', () => {
  it('exige a dica e aceita o treino vazio', () => {
    expect(parseMnemonic({ mnemonic: 'Imagine um gato.', practice: 'Desenhe 3 vezes.' })).toEqual({ mnemonic: 'Imagine um gato.', practice: 'Desenhe 3 vezes.' });
    expect(parseMnemonic({ mnemonic: 'Só a dica' })?.practice).toBe('');
    expect(parseMnemonic({ mnemonic: ' ' })).toBeNull();
    expect(parseMnemonic(null)).toBeNull();
  });
});

describe('parseMeaning', () => {
  it('aceita só os três veredictos e exige a observação', () => {
    expect(parseMeaning({ verdict: 'close', note: 'Faltou o tempo.' })).toEqual({ verdict: 'close', note: 'Faltou o tempo.' });
    expect(parseMeaning({ verdict: 'maybe', note: 'x' })).toBeNull();
    expect(parseMeaning({ verdict: 'ok', note: '' })).toBeNull();
  });
});

describe('parseRegisters', () => {
  const v = (register: string, jp = 'たべる') => ({ register, jp, reading: jp, when: 'Com amigos.' });

  it('ordena casual, educado e formal e ignora repetidas e desconhecidas', () => {
    const r = parseRegisters({ pt: 'Comer.', versions: [v('formal', 'めしあがる'), v('casual'), v('polite', 'たべます'), v('casual', 'repetida'), v('gíria')], note: '' });
    expect(r?.versions.map((x) => x.register)).toEqual(['casual', 'polite', 'formal']);
    expect(r?.versions[0]?.jp).toBe('たべる');
  });

  it('serve com só uma forma, mas exige o sentido e alguma forma', () => {
    expect(parseRegisters({ pt: 'x', versions: [v('polite')] })?.versions).toHaveLength(1);
    expect(parseRegisters({ pt: '', versions: [v('polite')] })).toBeNull();
    expect(parseRegisters({ pt: 'x', versions: [] })).toBeNull();
  });
});

describe('parseStory e knownShare', () => {
  const sentence = (jp: string, reading: string) => ({ jp, reading, pt: 'tradução' });

  it('lê o texto, descarta frases incompletas e exige título e 2 frases', () => {
    const story = parseStory({ title: 'Um dia', sentences: [sentence('わたしはがくせいです', 'わたしはがくせいです'), { jp: '', pt: 'x' }, sentence('ねこがすきです', 'ねこがすきです')] });
    expect(story?.sentences).toHaveLength(2);
    expect(parseStory({ title: '', sentences: [sentence('a', 'a'), sentence('b', 'b')] })).toBeNull();
    expect(parseStory({ title: 'x', sentences: [sentence('a', 'a')] })).toBeNull();
    expect(parseStory({ title: 'x' })).toBeNull();
  });

  it('conta as frases cobertas pelo vocabulário do app', () => {
    const story = { title: 't', sentences: [sentence('私は学生です', 'わたしはがくせいです'), sentence('x', 'ぬぬぬぬぬぬ'), sentence('y', '')] };
    expect(knownShare(story)).toEqual({ known: 1, total: 3 });
  });
});

describe('textos guardados', () => {
  it('guardam os mais novos primeiro, até o limite, e podem ser apagados', () => {
    const data = new Map<string, string>();
    const store = createAiStore({ getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v), removeItem: (k) => void data.delete(k) });
    for (let i = 0; i < MAX_STORIES + 3; i++) store.getState().addStory({ id: `s${i}`, at: i, topic: 't', title: `T${i}`, sentences: [] });
    expect(store.getState().stories).toHaveLength(MAX_STORIES);
    expect(store.getState().stories[0]?.id).toBe(`s${MAX_STORIES + 2}`);
    store.getState().removeStory(`s${MAX_STORIES + 2}`);
    expect(store.getState().stories[0]?.id).toBe(`s${MAX_STORIES + 1}`);
    store.getState().clearAll();
    expect(store.getState().stories).toEqual([]);
  });
});

describe('itens teimosos de vocabulário', () => {
  it('trazem o id da palavra para guardar a dica de memória', () => {
    const leeches = findLeeches({ srs: {}, vocab: { 'ねこ|jm': { b: 1, due: 0, l: 5 } }, conj: {}, particles: {} });
    const word = leeches.find((l) => l.area === 'vocab');
    expect(word?.id).toBe('ねこ');
    const particle = findLeeches({ srs: {}, vocab: {}, conj: {}, particles: { は: { b: 1, due: 0, l: 5 } } })[0];
    expect(particle?.id).toBeUndefined();
  });
});
