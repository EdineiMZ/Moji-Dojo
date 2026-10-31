import renderer from 'react-test-renderer';
import { useProgressStore } from '@/store';
import { ThemeProvider } from '@/theme';
import { emptyJourney } from '@/features/journey/journey';
import { houseWordOf } from '../words';
import { HomeView } from './HomeView';
import { VisitView, WordChallenge } from './HouseWords';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/features/journey/useMochiMood', () => ({ useMochiMood: () => ({ mood: 'happy', line: '' }) }));
jest.mock('@/features/speech/voiceStore', () => ({ speakJapanese: jest.fn() }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn(), preloadSfx: jest.fn() }));
jest.mock('@/lib/haptics', () => ({ hapticLight: jest.fn() }));
jest.mock('expo-sqlite/kv-store', () => {
  const data = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItemSync: (k: string) => data.get(k) ?? null,
      setItemSync: (k: string, v: string) => void data.set(k, v),
      removeItemSync: (k: string) => void data.delete(k),
    },
  };
});

const render = (element: React.ReactElement): renderer.ReactTestRenderer => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(<ThemeProvider>{element}</ThemeProvider>);
  });
  return tree;
};

const text = (tree: renderer.ReactTestRenderer): string => JSON.stringify(tree.toJSON());

describe('aba Casa', () => {
  it('mostra os cômodos, o saldo e o cômodo trancado com o preço', () => {
    useProgressStore.setState({ journey: { ...emptyJourney(), petals: 300 } });
    const all = text(render(<HomeView />));
    for (const label of ['Quarto', 'Jardim', 'Escritório', 'Trancado']) expect(all).toContain(label);
    expect(all).toContain('Comprar o cômodo por');
    expect(all).toContain('300');
  });

  it('com o cômodo comprado, lista os móveis e deixa comprar', () => {
    useProgressStore.setState({ journey: { ...emptyJourney(), petals: 300, home: { rooms: ['quarto'], furniture: ['cama'] } } });
    const all = text(render(<HomeView />));
    expect(all).toContain('Caminha');
    expect(all).toContain('Na casa');
    expect(all).toContain('Quarto, com 1 móvel');
  });
});

const buttons = (tree: renderer.ReactTestRenderer): renderer.ReactTestInstance[] => tree.root.findAllByProps({ accessibilityRole: 'button' }).filter((n) => typeof n.props.onPress === 'function');
const press = (tree: renderer.ReactTestRenderer, label: string): void => {
  const button = buttons(tree).find((b) => b.props.accessibilityLabel === label);
  if (!button) throw new Error(`sem botão "${label}"`);
  renderer.act(() => button.props.onPress());
};

describe('palavra da casa', () => {
  const word = houseWordOf('mesa');

  it('só conclui a compra quando a pessoa acerta o significado da palavra', () => {
    expect(word).toBeDefined();
    if (!word) return;
    const onDone = jest.fn();
    const tree = render(<WordChallenge word={word} name="Mesa de estudo" onDone={onDone} onCancel={jest.fn()} />);
    expect(text(tree)).toContain('机');
    const wrongOption = buttons(tree).find((b) => typeof b.props.accessibilityLabel === 'string' && b.props.accessibilityLabel !== word.meaning && !['Ouvir', 'Voltar'].includes(b.props.accessibilityLabel));
    renderer.act(() => wrongOption?.props.onPress());
    expect(onDone).not.toHaveBeenCalled();
    expect(text(tree)).toContain('Quase');
    press(tree, word.meaning);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('a visita guiada registra a primeira resposta de cada palavra na revisão', () => {
    const owned = ['mesa', 'cama', 'janela'].flatMap((id) => houseWordOf(id) ?? []);
    useProgressStore.setState({ vocab: {} });
    const record = jest.fn();
    useProgressStore.setState({ recordVocabAnswer: record });
    const tree = render(<VisitView owned={owned} onExit={jest.fn()} />);
    expect(text(tree)).toContain('Visita guiada');
    // Acerta a primeira pergunta pelo texto certo: ele aparece em um dos botões de alternativa.
    const first = buttons(tree).find((b) => owned.some((w) => b.props.accessibilityLabel === w.meaning || b.props.accessibilityLabel === w.jp));
    renderer.act(() => first?.props.onPress());
    expect(record).toHaveBeenCalledTimes(1);
  });
});
