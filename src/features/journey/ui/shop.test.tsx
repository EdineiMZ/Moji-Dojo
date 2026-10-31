import renderer from 'react-test-renderer';
import { useProgressStore, useSettingsStore } from '@/store';
import { ThemeProvider } from '@/theme';
import { ITEMS } from '../items';
import { emptyJourney } from '../journey';
import { ChestHost } from './ChestHost';
import { ShopView } from './ShopView';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
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

describe('loja', () => {
  beforeEach(() => useProgressStore.setState({ journey: { ...emptyJourney(), petals: 300 } }));

  it('mostra o saldo, as categorias, a raridade e os preços novos (os mais caros)', () => {
    const tree = render(<ShopView onPreview={jest.fn()} />);
    const all = text(tree);
    expect(all).toContain('300');
    for (const label of ['Cabeça', 'Rosto', 'Fundos', 'Cores', 'Peles', 'Coleção rara']) expect(all).toContain(label);
    expect(all).toContain('Comum');
    // o primeiro cartão é um item da loja, e o preço mais barato é 150
    expect(all).toContain('150');
  });

  it('mostra só uma página de cada vez e oferece "Mostrar mais"', () => {
    const tree = render(<ShopView onPreview={jest.fn()} />);
    expect(text(tree)).toContain('Mostrar mais');
    const total = ITEMS.length;
    expect(text(tree)).toContain(`"${total}"`);
  });
});

describe('baú do dia', () => {
  it('com o baú pronto e a introdução feita, aparece o pedido para abrir; sem introdução, nada', () => {
    useSettingsStore.setState({ profile: { username: 'Ana', onboarded: false, goalMinutes: 15 } });
    const today = (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();
    const journey = { ...emptyJourney(), today: { ...emptyJourney().today, day: today, opened: true, chest: 'ready' as const } };
    useProgressStore.setState({ journey });
    expect(render(<ChestHost />).toJSON()).toBeNull();

    useSettingsStore.setState({ profile: { username: 'Ana', onboarded: true, goalMinutes: 15 } });
    const tree = render(<ChestHost />);
    expect(text(tree)).toContain('Baú do dia');
    expect(text(tree)).toContain('Abrir o baú');
  });
  it('"Depois" adia o baú do dia: depois de fechar e abrir o app, ele não reaparece sozinho', () => {
    useSettingsStore.setState({ profile: { username: 'Ana', onboarded: true, goalMinutes: 15 } });
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    useProgressStore.setState({ journey: { ...emptyJourney(), today: { ...emptyJourney().today, day: today, opened: true, chest: 'ready' as const } } });

    const first = render(<ChestHost />);
    expect(text(first)).toContain('Abrir o baú');
    renderer.act(() => {
      first.root.findByProps({ accessibilityLabel: 'Depois' }).props.onPress();
    });
    expect(useProgressStore.getState().journey.today.dailyAsked).toBe(true);
    expect(useProgressStore.getState().journey.today.chest).toBe('ready');

    // Um app recém-aberto (estado novo do componente): o baú segue esperando, mas não abre por cima da tela.
    expect(render(<ChestHost />).toJSON()).toBeNull();
  });
});
