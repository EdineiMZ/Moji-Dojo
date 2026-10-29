import renderer, { type ReactTestInstance } from 'react-test-renderer';
import { speakJapanese } from '@/features/speech/voiceStore';
import { ThemeProvider } from '@/theme';
import { ChartView } from './ChartView';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn(), feedbackCorrect: jest.fn(), feedbackWrong: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn(), preloadSfx: jest.fn() }));
jest.mock('@/lib/haptics', () => ({ hapticLight: jest.fn() }));
jest.mock('@/features/speech/voiceStore', () => ({ speakJapanese: jest.fn() }));
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
        <ChartView />
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

function pressable(tree: renderer.ReactTestRenderer, match: (n: ReactTestInstance) => boolean): ReactTestInstance {
  const node = tree.root.findAll((n) => typeof n.props.onPress === 'function' && match(n))[0];
  if (!node) throw new Error('botão não encontrado');
  return node;
}
const pressLabel = (tree: renderer.ReactTestRenderer, label: string, index = 0) => {
  const hits = tree.root.findAll((n) => typeof n.type === 'string' && n.props.children === label);
  const targets = hits.map((h) => { let c: ReactTestInstance | null = h; while (c && typeof c.props.onPress !== 'function') c = c.parent; return c; }).filter((c): c is ReactTestInstance => !!c);
  const target = targets[index];
  if (!target) throw new Error(`"${label}" não encontrado`);
  renderer.act(() => target.props.onPress());
};

afterEach(() => {
  renderer.act(() => {
    for (const tree of mounted.splice(0)) tree.unmount();
  });
  jest.clearAllMocks();
});

describe('tabela, treino livre e parecidos', () => {
  it('mostra a tabela e, ao tocar numa letra, toca o som e mostra o exemplo e a dica', () => {
    const tree = render();
    expect(text(tree)).toContain('Toque numa letra');
    const cell = pressable(tree, (n) => n.props.accessibilityLabel === 'が, ga' || n.props.accessibilityLabel === 'か, ka');
    renderer.act(() => cell.props.onPress());
    expect(speakJapanese).toHaveBeenCalledWith('か', expect.any(Number));
    expect(text(tree)).toContain('か = ka');
    expect(text(tree)).toContain('Exemplo:');
  });

  it('o conjunto com ten-ten mostra a dica do kana base', () => {
    const tree = render();
    pressLabel(tree, 'Com ten-ten e maru');
    const cell = pressable(tree, (n) => n.props.accessibilityLabel === 'が, ga');
    renderer.act(() => cell.props.onPress());
    expect(text(tree)).toContain('か (ka) mais as duas gotinhas');
  });

  it('o treino livre pergunta o som, corrige a resposta e conta o placar sem tocar nas revisões', () => {
    const tree = render();
    pressLabel(tree, 'Treino livre');
    expect(text(tree)).toContain('QUAL É O SOM?');
    expect(text(tree)).toContain('0 de 0 certas');
    expect(text(tree)).toContain('não mexe nas suas revisões');
    const option = tree.root.findAll((n) => typeof n.props.onPress === 'function' && n.props.accessibilityRole === 'button' && !n.props.accessibilityLabel?.startsWith?.('Letra'))[0];
    renderer.act(() => option?.props.onPress());
    expect(text(tree)).toMatch(/Certo!|Era /);
    expect(text(tree)).toContain('de 1 certas');
  });

  it('os parecidos listam o par, a dica e levam ao treino só daquelas letras', () => {
    const tree = render();
    pressLabel(tree, 'Parecidos');
    expect(text(tree)).toContain('O ぬ termina com um laço');
    pressLabel(tree, 'Treinar estas letras');
    expect(text(tree)).toContain('Treinando só: ぬ め');
    pressLabel(tree, 'Voltar a todas as letras');
    expect(text(tree)).not.toContain('Treinando só');
  });

  it('o katakana tem os seus próprios pares', () => {
    const tree = render();
    pressLabel(tree, 'Parecidos');
    pressLabel(tree, 'Katakana');
    expect(text(tree)).toContain('シ');
    expect(text(tree)).toContain('os pingos ficam deitados');
  });
});
