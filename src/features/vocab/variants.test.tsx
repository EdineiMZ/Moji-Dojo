import renderer from 'react-test-renderer';
import { VOCAB, type VocabWord } from '@/content';
import { ThemeProvider } from '@/theme';
import { BuildWordQuestion } from '@/features/quiz/BuildWordQuestion';
import { TypeWordQuestion } from '@/features/quiz/TypeWordQuestion';
import { answerReview, DAY_MS, type SrsEntry } from '@/features/review/srs';
import { resolveQuestion, startQuiz } from '@/features/quiz/quiz';
import { cardKey, isKanaOnly } from './cards';
import { buildVocabQuestions, questionCardKey } from './questions';
import {
  BUILD_FROM_BOX,
  EXTRA_TILES,
  MAX_BUILD_UNITS,
  TYPE_FROM_BOX,
  buildTiles,
  buildUnits,
  builtText,
  toHiragana,
  typedMatches,
  variantFor,
} from './variants';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn(), preloadSfx: jest.fn() }));
jest.mock('@/lib/haptics', () => ({ hapticLight: jest.fn() }));
jest.mock('expo-sqlite/kv-store', () => ({ __esModule: true, default: { getItemSync: () => null, setItemSync: jest.fn(), removeItemSync: jest.fn() } }));

const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const find = (jp: string): VocabWord => VOCAB.find((w) => w.jp === jp) as VocabWord;
const kanaWord = find('ねこ');
const katakanaWord = find('テレビ');
const kanjiWord = VOCAB.find((w) => !isKanaOnly(w)) as VocabWord;

// Quarta, 21/10/2026, 10:00 (fuso local).
const NOW = new Date(2026, 9, 21, 10, 0);

describe('qual variante cada cartão recebe', () => {
  it('escolha nas caixas baixas e em cartão novo; montar da caixa 3; digitar da caixa 5', () => {
    expect(variantFor(kanaWord, 'mj', undefined)).toBe('choice');
    expect(variantFor(kanaWord, 'mj', 1)).toBe('choice');
    expect(variantFor(kanaWord, 'mj', BUILD_FROM_BOX - 1)).toBe('choice');
    expect(variantFor(kanaWord, 'mj', BUILD_FROM_BOX)).toBe('build');
    expect(variantFor(kanaWord, 'mj', TYPE_FROM_BOX - 1)).toBe('build');
    expect(variantFor(kanaWord, 'mj', TYPE_FROM_BOX)).toBe('type');
    expect(variantFor(kanaWord, 'mj', 6)).toBe('type');
  });

  it('só o cartão significado → escrita (mj) de palavra só de kana muda; o resto continua sendo escolha', () => {
    for (const dir of ['jm', 'au', 'rd']) expect(variantFor(kanaWord, dir, 6)).toBe('choice');
    expect(variantFor(kanjiWord, 'mj', 6)).toBe('choice');
  });

  it('palavra em katakana é montada com peças de katakana e digitada em hiragana', () => {
    expect(variantFor(katakanaWord, 'mj', 6)).toBe('type');
    expect(typedMatches(katakanaWord, 'てれび')).toBe(true);
    expect(typedMatches(katakanaWord, 'テレビ')).toBe(true);
    expect(typedMatches(katakanaWord, 'てれひ')).toBe(false);
  });

  it('palavra comprida demais para a tela fica na escolha na montagem', () => {
    const long = VOCAB.find((w) => isKanaOnly(w) && buildUnits(w.jp).length > MAX_BUILD_UNITS);
    if (long) expect(variantFor(long, 'mj', BUILD_FROM_BOX)).toBe('choice');
  });
});

describe('peças e conferência', () => {
  it('sílabas com kana pequeno ficam juntas; っ e ー são peças', () => {
    expect(buildUnits('きょう')).toEqual(['きょ', 'う']);
    expect(buildUnits('しゃしん')).toEqual(['しゃ', 'し', 'ん']);
    expect(buildUnits('きって')).toEqual(['き', 'っ', 'て']);
    expect(buildUnits('ラーメン')).toEqual(['ラ', 'ー', 'メ', 'ン']);
    expect(buildUnits('ファン')).toEqual(['ファ', 'ン']);
  });

  it('as peças são as da palavra mais 2 de enfeite que nunca repetem uma da palavra', () => {
    for (let i = 1; i <= 50; i++) {
      const tiles = buildTiles(kanaWord.jp, seeded(i));
      expect(tiles).toHaveLength(buildUnits(kanaWord.jp).length + EXTRA_TILES);
      expect(new Set(tiles.map((t) => t.id)).size).toBe(tiles.length);
      const texts = tiles.map((t) => t.text);
      expect(new Set(texts).size).toBe(texts.length); // sem peça repetida: o enfeite nunca é igual a uma da palavra
      for (const u of buildUnits(kanaWord.jp)) expect(texts).toContain(u);
    }
  });

  it('palavra em katakana ganha enfeites em katakana', () => {
    const extras = buildTiles('テレビ', seeded(3)).map((t) => t.text).filter((t) => !buildUnits('テレビ').includes(t));
    expect(extras).toHaveLength(EXTRA_TILES);
    expect(extras.every((t) => /[ァ-ヶ]/u.test(t))).toBe(true);
  });

  it('o enfeite prefere kana parecido com os da palavra (ね → れ, わ)', () => {
    let hits = 0;
    for (let i = 1; i <= 40; i++) {
      const extras = buildTiles('ねこ', seeded(i)).map((t) => t.text).filter((t) => t !== 'ね' && t !== 'こ');
      if (extras.some((t) => ['れ', 'わ', 'に'].includes(t))) hits++;
    }
    expect(hits).toBe(40);
  });

  it('montar na ordem certa confere; fora de ordem, não; vazio ("Não sei") nunca', () => {
    const tiles = buildTiles('ねこ', seeded(5));
    const idOf = (text: string) => tiles.find((t) => t.text === text)?.id as number;
    expect(builtText(tiles, [idOf('ね'), idOf('こ')])).toBe('ねこ');
    expect(builtText(tiles, [idOf('こ'), idOf('ね')])).toBe('こね');
    expect(typedMatches(kanaWord, builtText(tiles, [idOf('ね'), idOf('こ')]))).toBe(true);
    expect(typedMatches(kanaWord, 'こね')).toBe(false);
    expect(typedMatches(kanaWord, '')).toBe(false);
  });

  it('digitar ignora espaços e confere em hiragana', () => {
    expect(typedMatches(kanaWord, ' ね こ ')).toBe(true);
    expect(toHiragana('ラーメン')).toBe('らーめん');
  });
});

describe('as perguntas mudam com a caixa do cartão, sem cartão novo', () => {
  const key = cardKey(kanaWord.id, 'mj');
  const entry = (b: number): SrsEntry => ({ b, due: NOW.getTime() });

  it('a mesma chave vira escolha, montagem ou digitação; o cartão que a pergunta representa é sempre o mj', () => {
    const modes = [1, 2, 3, 4, 5, 6].map((b) => {
      const [q] = buildVocabQuestions([key], seeded(b), { [key]: entry(b) });
      expect(q).toBeDefined();
      expect(questionCardKey(q!)).toBe(key);
      return [q!.mode ?? 'choice', q!.options.length, q!.tiles?.length ?? 0];
    });
    expect(modes.map((m) => m[0])).toEqual(['choice', 'choice', 'build', 'build', 'type', 'type']);
    expect(modes.map((m) => m[1])).toEqual([4, 4, 0, 0, 0, 0]);
    expect(modes[2]?.[2]).toBeGreaterThan(0);
    expect(modes[4]?.[2]).toBe(0);
  });

  it('sem o estado da revisão, tudo é por alternativas (compatível com quem chama como antes)', () => {
    const [q] = buildVocabQuestions([key], seeded(1));
    expect(q?.mode).toBeUndefined();
    expect(q?.options).toHaveLength(4);
  });

  it('o outro cartão da mesma palavra (jm) continua sendo escolha na caixa alta', () => {
    const jm = cardKey(kanaWord.id, 'jm');
    const [q] = buildVocabQuestions([jm], seeded(1), { [jm]: entry(6) });
    expect(q?.mode).toBeUndefined();
  });

  it('com o tempo passando (relógio fixo), acertar de primeira leva o cartão da escolha à montagem e à digitação', () => {
    jest.useFakeTimers();
    try {
      let now = NOW.getTime();
      jest.setSystemTime(now);
      let card: SrsEntry = { b: 1, due: now };
      const seen: string[] = [];
      for (let review = 0; review < 14; review++) {
        const [q] = buildVocabQuestions([key], seeded(review + 1), { [key]: card });
        const mode = q?.mode ?? 'choice';
        if (seen.at(-1) !== mode) seen.push(mode);
        card = answerReview(card, true, false, now);
        now = Math.max(now, card.due);
        jest.setSystemTime(now);
      }
      expect(seen).toEqual(['choice', 'build', 'type']);
    } finally {
      jest.useRealTimers();
    }
  });

  it('errar na digitação volta o cartão à caixa 1 e, na próxima, a pergunta é por alternativas de novo', () => {
    const card = answerReview({ b: 6, due: NOW.getTime(), s: 90, d: 5, t: NOW.getTime() - 60 * DAY_MS }, false, false, NOW.getTime());
    expect(card.b).toBe(1);
    const [q] = buildVocabQuestions([key], seeded(2), { [key]: card });
    expect(q?.mode).toBeUndefined();
  });

  it('errar a montagem recoloca a mesma pergunta (com as peças) mais adiante; acertar a conclui', () => {
    const [q] = buildVocabQuestions([key], seeded(4), { [key]: entry(3) });
    const state = startQuiz([q!, ...buildVocabQuestions([cardKey(find('いぬ').id, 'mj')], seeded(1), { [cardKey(find('いぬ').id, 'mj')]: entry(3) })]);
    const wrong = resolveQuestion(state, false, seeded(9));
    expect(wrong.correct).toBe(false);
    const retry = wrong.state.queue.find((x) => x.retry);
    expect(retry?.mode).toBe('build');
    expect(retry?.tiles).toEqual(q!.tiles);
    expect(resolveQuestion(state, true).state.done).toBe(1);
  });
});

describe('as telas', () => {
  const mounted: renderer.ReactTestRenderer[] = [];
  const render = (el: React.ReactElement) => {
    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(<ThemeProvider>{el}</ThemeProvider>);
    });
    mounted.push(tree);
    return tree;
  };
  afterEach(() => renderer.act(() => mounted.splice(0).forEach((t) => t.unmount())));

  const press = (tree: renderer.ReactTestRenderer, label: string) => {
    const nodes = tree.root.findAll((n) => n.props.accessibilityLabel === label && typeof n.props.onPress === 'function' && n.props.disabled !== true);
    if (nodes.length === 0) throw new Error(`sem botão "${label}"`);
    renderer.act(() => nodes[0]!.props.onPress());
  };
  /** Botão do app (Button recebe `label`). */
  const pressButton = (tree: renderer.ReactTestRenderer, label: string) => {
    const nodes = tree.root.findAll((n) => n.props.label === label && typeof n.props.onPress === 'function' && n.props.disabled !== true);
    if (nodes.length === 0) throw new Error(`sem botão "${label}" habilitado`);
    renderer.act(() => nodes[0]!.props.onPress());
  };
  const hasText = (tree: renderer.ReactTestRenderer, text: string) => JSON.stringify(tree.toJSON()).includes(text);

  it('montar: toca nas peças, vê o que montou, tira uma, confere', () => {
    const tiles = buildTiles('ねこ', seeded(3));
    const onSubmit = jest.fn();
    const tree = render(<BuildWordQuestion meaning="gato" tiles={tiles} locked={false} onSubmit={onSubmit} />);
    expect(hasText(tree, 'MONTE A PALAVRA')).toBe(true);
    expect(hasText(tree, 'gato')).toBe(true);
    press(tree, 'こ');
    press(tree, 'ね');
    expect(hasText(tree, 'Montado até agora: こね')).toBe(true);
    press(tree, 'Tirar こ');
    expect(hasText(tree, 'Montado até agora: ね')).toBe(true);
    press(tree, 'こ');
    pressButton(tree, 'Conferir');
    expect(onSubmit).toHaveBeenCalledWith('ねこ');
  });

  it('montar: "Não sei" envia vazio e travado não deixa mais tocar nem conferir', () => {
    const tiles = buildTiles('ねこ', seeded(3));
    const onSubmit = jest.fn();
    const tree = render(<BuildWordQuestion meaning="gato" tiles={tiles} locked={false} onSubmit={onSubmit} />);
    pressButton(tree, 'Não sei');
    expect(onSubmit).toHaveBeenCalledWith('');
    const locked = render(<BuildWordQuestion meaning="gato" tiles={tiles} locked onSubmit={onSubmit} />);
    expect(hasText(locked, 'Conferir')).toBe(false);
    expect(hasText(locked, 'Não sei')).toBe(false);
  });

  it('digitar: mostra o significado e o teclado de flick; travado esconde o teclado e os botões', () => {
    const onSubmit = jest.fn();
    const tree = render(<TypeWordQuestion meaning="gato" locked={false} onSubmit={onSubmit} />);
    expect(hasText(tree, 'DIGITE A PALAVRA')).toBe(true);
    expect(hasText(tree, 'Use o teclado abaixo')).toBe(true);
    expect(hasText(tree, 'Conferir')).toBe(true);
    expect(() => pressButton(tree, 'Conferir')).toThrow(); // nada digitado: o botão está desabilitado
    pressButton(tree, 'Não sei');
    expect(onSubmit).toHaveBeenCalledWith('');
    const locked = render(<TypeWordQuestion meaning="gato" locked onSubmit={onSubmit} />);
    expect(hasText(locked, 'Conferir')).toBe(false);
  });
});
