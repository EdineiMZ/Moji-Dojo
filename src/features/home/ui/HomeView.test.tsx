import renderer from 'react-test-renderer';
import { useProgressStore } from '@/store';
import { ThemeProvider } from '@/theme';
import { emptyJourney } from '@/features/journey/journey';
import { HomeView } from './HomeView';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/features/journey/useMochiMood', () => ({ useMochiMood: () => ({ mood: 'happy', line: '' }) }));
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
