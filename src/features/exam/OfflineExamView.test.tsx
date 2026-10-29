import renderer, { type ReactTestInstance } from 'react-test-renderer';
import { ThemeProvider } from '@/theme';
import { OfflineExamView } from './OfflineExamView';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn(), feedbackCorrect: jest.fn(), feedbackWrong: jest.fn(), feedbackComplete: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn(), preloadSfx: jest.fn() }));
jest.mock('@/lib/haptics', () => ({ hapticLight: jest.fn() }));
jest.mock('expo-sqlite/kv-store', () => {
  const data = new Map<string, string>();
  return { __esModule: true, default: { getItemSync: (k: string) => data.get(k) ?? null, setItemSync: (k: string, v: string) => void data.set(k, v), removeItemSync: (k: string) => void data.delete(k) } };
});

const mounted: renderer.ReactTestRenderer[] = [];
const render = (): renderer.ReactTestRenderer => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(
      <ThemeProvider>
        <OfflineExamView />
      </ThemeProvider>,
    );
  });
  mounted.push(tree);
  return tree;
};

function flat(node: unknown): string {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flat).join('');
  return flat((node as { children?: unknown }).children);
}
const text = (tree: renderer.ReactTestRenderer) => flat(tree.toJSON());

const press = (tree: renderer.ReactTestRenderer, label: string) => {
  const hit = tree.root.findAll((n) => typeof n.type === 'string' && n.props.children === label)[0];
  let target: ReactTestInstance | null = hit ?? null;
  while (target && typeof target.props.onPress !== 'function') target = target.parent;
  if (!target) throw new Error(`"${label}" não encontrado`);
  renderer.act(() => target.props.onPress());
};

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  renderer.act(() => {
    for (const tree of mounted.splice(0)) tree.unmount();
  });
  jest.useRealTimers();
});

describe('simulado com tempo de prova', () => {
  it('sem tempo, não mostra cronômetro e nunca acaba sozinho', () => {
    const tree = render();
    press(tree, 'Começar o simulado');
    expect(text(tree)).not.toContain('⏱');
    renderer.act(() => jest.advanceTimersByTime(60 * 60_000));
    expect(text(tree)).not.toContain('O tempo acabou');
    expect(text(tree)).toContain('1 DE 20');
  });

  it('com tempo, mostra o cronômetro regressivo da prova toda', () => {
    const tree = render();
    press(tree, 'Tempo de prova (45 s por pergunta)');
    expect(text(tree)).toContain('15:00');
    press(tree, 'Começar o simulado');
    expect(text(tree)).toContain('⏱ 15:00');
    renderer.act(() => jest.advanceTimersByTime(65_000));
    expect(text(tree)).toContain('⏱ 13:55');
  });

  it('quando o tempo acaba, encerra a prova e as perguntas sem resposta contam como erradas', () => {
    const tree = render();
    press(tree, 'Tempo de prova (45 s por pergunta)');
    press(tree, 'Começar o simulado');
    renderer.act(() => jest.advanceTimersByTime(15 * 60_000 + 2_000));
    expect(text(tree)).toContain('Simulado concluído');
    expect(text(tree)).toContain('O tempo acabou.');
    expect(text(tree)).toContain('20 perguntas ficaram sem resposta');
    expect(text(tree)).toContain('0 de 5 (0%)');
  });
});
