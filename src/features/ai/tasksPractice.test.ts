import type { DialogScene } from '@/content/dialogs';
import { createAiStore, MAX_EXAMS, MAX_SCENES, type StoredExam } from './aiStore';
import { MIN_YOU_TURNS, parseExam, parseScene, sceneRomaji, shuffleQuestion } from './tasksPractice';

describe('sceneRomaji', () => {
  it('lê は, へ e を como partículas, soltas ou coladas no fim da palavra', () => {
    expect(sceneRomaji('わたし は がくせい です')).toBe('watashi wa gakusei desu');
    expect(sceneRomaji('えき へ いきます')).toBe('eki e ikimasu');
    expect(sceneRomaji('のみものは いかが')).toBe('nomimonowa ikaga');
    expect(sceneRomaji('みず を ください')).toBe('mizu o kudasai');
  });
});

const you = (right: string, wrong: string[]) => ({
  kind: 'you',
  options: [
    { jp: right, pt: 'certa', ok: true },
    ...wrong.map((jp) => ({ jp, pt: 'errada', ok: false, why: 'Não cabe aqui.' })),
  ],
});

describe('parseScene', () => {
  const base = {
    title: 'Na estação',
    intro: 'Você compra um bilhete.',
    turns: [
      { kind: 'narrator', pt: 'Você chega ao guichê.' },
      { kind: 'staff', jp: 'いらっしゃいませ。どこ まで です か。', pt: 'Para onde?' },
      you('とうきょう まで です', ['みず を ください', 'おはよう ございます']),
      { kind: 'staff', jp: 'おかね を ください', pt: 'O dinheiro, por favor.' },
      you('はい どうぞ', ['いいえ けっこう です']),
    ],
  };

  it('monta a cena: tira a pontuação, calcula o romaji e deixa o porquê só nas erradas', () => {
    const scene = parseScene(base);
    expect(scene?.title).toBe('Na estação');
    const staff = scene?.turns[1];
    expect(staff).toEqual({ kind: 'staff', jp: 'いらっしゃいませ どこ まで です か', romaji: 'irasshaimase doko made desu ka', pt: 'Para onde?' });
    const turn = scene?.turns[2];
    if (turn?.kind !== 'you') throw new Error('esperava um turno do aluno');
    expect(turn.options.map((o) => o.ok)).toEqual([true, false, false]);
    expect(turn.options[0]).not.toHaveProperty('why');
    expect(turn.options[1]?.why).toBe('Não cabe aqui.');
    expect(turn.options[0]?.romaji).toBe('tōkyō made desu');
  });

  it('descarta falas com kanji e turnos sem exatamente uma resposta certa', () => {
    const scene = parseScene({
      ...base,
      turns: [
        { kind: 'staff', jp: '駅はどこですか', pt: 'kanji não serve' },
        { kind: 'staff', jp: 'どこ へ', pt: 'Para onde?' },
        you('とうきょう', ['みず']),
        { kind: 'you', options: [{ jp: 'あ', pt: 'a', ok: true }, { jp: 'い', pt: 'i', ok: true, why: 'x' }, { jp: 'う', pt: 'u', ok: false, why: 'y' }] },
        { kind: 'you', options: [{ jp: 'あ', pt: 'a', ok: true }, { jp: 'い', pt: 'i', ok: false }] },
        you('はい', ['いいえ']),
      ],
    });
    expect(scene?.turns.filter((t) => t.kind === 'staff')).toHaveLength(1);
    // Só os dois turnos válidos sobram (duas certas e erradas sem porquê saem).
    expect(scene?.turns.filter((t) => t.kind === 'you')).toHaveLength(MIN_YOU_TURNS);
  });

  it('exige título, introdução e pelo menos dois turnos do aluno', () => {
    expect(parseScene({ ...base, title: '' })).toBeNull();
    expect(parseScene({ ...base, intro: '' })).toBeNull();
    expect(parseScene({ ...base, turns: [base.turns[1], base.turns[2]] })).toBeNull();
    expect(parseScene({ title: 'x', intro: 'y' })).toBeNull();
    expect(parseScene(null)).toBeNull();
  });
});

describe('parseExam', () => {
  const q = (over: Record<string, unknown> = {}) => ({
    prompt: 'わたしは ごはん ＿＿＿ たべます。',
    passage: '',
    pt: 'Eu como arroz.',
    options: ['を', 'に', 'で', 'と'],
    explanation: 'を marca o objeto direto.',
    answerText: 'を',
    answer: 0,
    ...over,
  });
  const three = [q(), q({ prompt: 'b' }), q({ prompt: 'c' })];

  it('aceita questões coerentes e exige o mínimo', () => {
    expect(parseExam({ questions: three })).toHaveLength(3);
    expect(parseExam({ questions: [q(), q()] })).toBeNull();
    expect(parseExam({})).toBeNull();
  });

  it('descarta a questão quando a alternativa copiada não bate com a posição dada', () => {
    const list = parseExam({ questions: [...three, q({ answer: 2 })] });
    expect(list).toHaveLength(3);
  });

  it('descarta alternativas repetidas, vazias ou em número errado', () => {
    const bad = [q({ options: ['を', 'を', 'で', 'と'] }), q({ options: ['を', '', 'で', 'と'] }), q({ options: ['を', 'に', 'で'] }), q({ answer: 4 }), q({ answer: 0.5 })];
    expect(parseExam({ questions: [...three, ...bad] })).toHaveLength(3);
  });

  it('descarta gabaritos que citam a posição da alternativa, pois elas são embaralhadas', () => {
    const positional = ['A alternativa 2 está correta.', 'A terceira opção serve.', 'Letra B.', 'A opção (3) é a certa.'];
    const list = parseExam({ questions: [...three, ...positional.map((explanation) => q({ explanation }))] });
    expect(list).toHaveLength(3);
    // "opção correta" e "item" sem número não são posição.
    expect(parseExam({ questions: [...three, q({ explanation: 'A opção correta é を, pois marca o objeto.' })] })).toHaveLength(4);
  });

  it('só guarda o texto de apoio na seção de leitura, onde ele é obrigatório', () => {
    const withText = [1, 2, 3].map((n) => q({ prompt: `p${n}`, passage: `texto ${n}` }));
    expect(parseExam({ questions: withText })?.[0]?.passage).toBe('');
    expect(parseExam({ questions: withText }, true)?.[0]?.passage).toBe('texto 1');
    expect(parseExam({ questions: three }, true)).toBeNull();
  });
});

describe('shuffleQuestion', () => {
  it('mantém as mesmas alternativas e o índice da certa acompanha o texto dela', () => {
    const question = { prompt: 'p', passage: '', pt: '', options: ['a', 'b', 'c', 'd'], answer: 2, explanation: 'e' };
    for (let i = 0; i < 20; i++) {
      const shuffled = shuffleQuestion(question, () => (i % 7) / 7);
      expect([...shuffled.options].sort()).toEqual(['a', 'b', 'c', 'd']);
      expect(shuffled.options[shuffled.answer]).toBe('c');
    }
  });
});

describe('cenas e simulados guardados', () => {
  const memory = () => {
    const data = new Map<string, string>();
    return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v), removeItem: (k: string) => void data.delete(k) };
  };
  const scene = (id: string): DialogScene => ({ id, title: id, place: 'Viagem', intro: 'i', turns: [] });
  const exam = (id: string): StoredExam => ({ id, at: 0, level: 'N5', section: 'grammar', questions: [], best: null });

  it('guardam as cenas mais novas primeiro, até o limite', () => {
    const store = createAiStore(memory());
    for (let i = 0; i < MAX_SCENES + 2; i++) store.getState().addScene(scene(`s${i}`));
    expect(store.getState().scenes).toHaveLength(MAX_SCENES);
    expect(store.getState().scenes[0]?.id).toBe(`s${MAX_SCENES + 1}`);
    store.getState().removeScene(`s${MAX_SCENES + 1}`);
    expect(store.getState().scenes[0]?.id).toBe(`s${MAX_SCENES}`);
  });

  it('guardam os simulados até o limite e só aumentam a melhor nota', () => {
    const store = createAiStore(memory());
    for (let i = 0; i < MAX_EXAMS + 2; i++) store.getState().addExam(exam(`x${i}`));
    expect(store.getState().exams).toHaveLength(MAX_EXAMS);
    const id = `x${MAX_EXAMS + 1}`;
    store.getState().recordExamScore(id, 3);
    store.getState().recordExamScore(id, 2);
    expect(store.getState().exams[0]?.best).toBe(3);
    store.getState().recordExamScore(id, 5);
    expect(store.getState().exams[0]?.best).toBe(5);
    store.getState().clearAll();
    expect(store.getState().exams).toEqual([]);
    expect(store.getState().scenes).toEqual([]);
  });
});
