import renderer from 'react-test-renderer';
import { findWord, VOCAB } from '@/content';
import { ThemeProvider } from '@/theme';
import { useProgressStore } from '@/store';
import { toQuizItem } from '@/features/vocab/questions';
import { vocabWordOf, wordMnemonicFallback } from '@/features/vocab/kanjiWords';
import { MnemonicNote } from './MnemonicNote';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn(), preloadSfx: jest.fn() }));
jest.mock('@/lib/haptics', () => ({ hapticLight: jest.fn() }));
jest.mock('expo-sqlite/kv-store', () => ({ __esModule: true, default: { getItemSync: () => null, setItemSync: jest.fn(), removeItemSync: jest.fn() } }));

const mounted: renderer.ReactTestRenderer[] = [];
const render = (el: React.ReactElement) => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(<ThemeProvider>{el}</ThemeProvider>);
  });
  mounted.push(tree);
  return tree;
};
afterEach(() => {
  renderer.act(() => mounted.splice(0).forEach((t) => t.unmount()));
  useProgressStore.setState({ wordNotes: {}, charNotes: {} });
});

const textOf = (tree: renderer.ReactTestRenderer): string => JSON.stringify(tree.toJSON());

describe('historinha de palavra', () => {
  it('a pronta vem dos kanji da palavra (significado + dica do app)', () => {
    const word = findWord('日本人') as (typeof VOCAB)[number];
    const text = wordMnemonicFallback(word);
    expect(text).toContain('日 = dia, sol (Um sol com uma linha no meio)');
    expect(text).toContain('人 = pessoa');
  });

  it('palavra só de kana não tem historinha pronta; item que não é palavra do vocabulário também não', () => {
    const kana = VOCAB.find((w) => w.kanji.length === 0) as (typeof VOCAB)[number];
    expect(wordMnemonicFallback(kana)).toBeUndefined();
    expect(vocabWordOf({ script: 'pair', char: 'não é palavra' })).toBeUndefined();
    expect(vocabWordOf({ script: 'hira', char: 'あ' })).toBeUndefined();
    expect(vocabWordOf(toQuizItem(kana))?.id).toBe(kana.id);
  });

  it('ao errar, mostra a pronta; a que a pessoa escreve passa a valer no lugar dela e fica em wordNotes', () => {
    const word = findWord('日本人') as (typeof VOCAB)[number];
    const fallback = wordMnemonicFallback(word) as string;
    const tree = render(<MnemonicNote char={word.id} kind="word" fallback={fallback} />);
    expect(textOf(tree)).toContain('Para lembrar: ');
    expect(textOf(tree)).toContain('Escrever a minha historinha');

    let saved = false;
    renderer.act(() => {
      saved = useProgressStore.getState().setWordNote(word.id, ' Um japonês no sol nascente ');
    });
    expect(saved).toBe(true);
    renderer.act(() => tree.update(<ThemeProvider><MnemonicNote char={word.id} kind="word" fallback={fallback} /></ThemeProvider>));
    expect(textOf(tree)).toContain('Sua historinha: ');
    expect(textOf(tree)).toContain('Um japonês no sol nascente');
    expect(textOf(tree)).not.toContain('Um sol com uma linha no meio');
    expect(useProgressStore.getState().wordNotes[word.id]).toBe('Um japonês no sol nascente');
    expect(useProgressStore.getState().charNotes[word.id]).toBeUndefined();
  });

  it('a nota de kana continua indo para charNotes', () => {
    render(<MnemonicNote char="あ" />);
    let saved = false;
    renderer.act(() => {
      saved = useProgressStore.getState().setCharNote('あ', 'um anzol');
    });
    expect(saved).toBe(true);
    expect(useProgressStore.getState().charNotes['あ']).toBe('um anzol');
    expect(useProgressStore.getState().wordNotes['あ']).toBeUndefined();
  });

  it('limpar a nota volta à pronta', () => {
    const word = findWord('日本人') as (typeof VOCAB)[number];
    useProgressStore.getState().setWordNote(word.id, 'minha');
    useProgressStore.getState().setWordNote(word.id, '');
    expect(useProgressStore.getState().wordNotes[word.id]).toBeUndefined();
  });
});
