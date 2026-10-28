import renderer from 'react-test-renderer';
import { ThemeProvider } from '@/theme';
import { ChipRow } from './ChipRow';
import { LearnMore } from './LearnMore';
import { ListRow } from './ListRow';
import { AppText } from './AppText';

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
afterEach(() => renderer.act(() => mounted.splice(0).forEach((t) => t.unmount())));

const flat = (n: unknown): string => (n == null ? '' : typeof n === 'string' ? n : Array.isArray(n) ? n.map(flat).join('') : flat((n as { children?: unknown }).children));

describe('LearnMore', () => {
  it('esconde o texto até tocar em "Saiba mais"', () => {
    const tree = render(
      <LearnMore>
        <AppText>detalhe longo</AppText>
      </LearnMore>,
    );
    expect(flat(tree.toJSON())).not.toContain('detalhe longo');
    const toggle = tree.root.findAll((n) => typeof n.props.onPress === 'function')[0]!;
    renderer.act(() => toggle.props.onPress());
    expect(flat(tree.toJSON())).toContain('detalhe longo');
    expect(flat(tree.toJSON())).toContain('Mostrar menos');
  });
});

describe('ListRow', () => {
  it('junta título e resumo no rótulo de acessibilidade e chama onPress', () => {
    const onPress = jest.fn();
    const tree = render(<ListRow icon="🔔" title="Lembretes" summary="Leves · Noite (20h)" onPress={onPress} />);
    const row = tree.root.findAll((n) => n.props.accessibilityLabel === 'Lembretes. Leves · Noite (20h)')[0]!;
    renderer.act(() => row.props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('ChipRow wrap', () => {
  it('mostra todas as opções sem rolagem horizontal', () => {
    const options = [1, 2, 3, 4, 5, 6, 7].map((n) => ({ value: String(n), label: `op ${n}` }));
    const tree = render(<ChipRow wrap options={options} value="2" onChange={() => undefined} />);
    expect(tree.root.findAll((n) => n.props.horizontal === true)).toHaveLength(0);
    expect(flat(tree.toJSON())).toContain('op 7');
  });
});
