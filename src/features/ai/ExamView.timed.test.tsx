import renderer, { type ReactTestInstance } from 'react-test-renderer';
import { useAiStore } from '@/store';
import { ThemeProvider } from '@/theme';
import { ExamView } from './ExamView';
import type { StoredExam } from './aiStore';
import { useAiReady } from './useAi';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn(), feedbackCorrect: jest.fn(), feedbackWrong: jest.fn(), feedbackComplete: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn(), preloadSfx: jest.fn() }));
jest.mock('@/lib/haptics', () => ({ hapticLight: jest.fn() }));
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }), router: { navigate: jest.fn() }, useFocusEffect: jest.fn() }));
jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn(async () => null), setItemAsync: jest.fn(), deleteItemAsync: jest.fn() }));
jest.mock('./useAi', () => ({ useAiReady: jest.fn(() => true), ask: jest.fn() }));
jest.mock('expo-sqlite/kv-store', () => {
  const data = new Map<string, string>();
  return { __esModule: true, default: { getItemSync: (k: string) => data.get(k) ?? null, setItemSync: (k: string, v: string) => void data.set(k, v), removeItemSync: (k: string) => void data.delete(k) } };
});

const question = (n: number) => ({ prompt: `わたしは「学生」です。${n}`, passage: '', pt: 'Eu sou estudante.', options: ['a', 'b', 'c', 'd'], answer: 0, explanation: 'Porque sim.' });
const exam: StoredExam = { id: 'e1', at: 1, level: 'N5', section: 'vocab', questions: [question(1), question(2), question(3)], best: null };

const mounted: renderer.ReactTestRenderer[] = [];
const render = (): renderer.ReactTestRenderer => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(
      <ThemeProvider>
        <ExamView />
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

beforeEach(() => {
  jest.useFakeTimers();
  (useAiReady as jest.Mock).mockReturnValue(true);
  useAiStore.setState({ exams: [exam] });
});
afterEach(() => {
  renderer.act(() => {
    for (const tree of mounted.splice(0)) tree.unmount();
  });
  jest.useRealTimers();
  useAiStore.setState({ exams: [] });
});

describe('simulado da IA com tempo de prova', () => {
  it('com tempo, mostra o cronômetro da prova toda e, ao acabar, as questões sem resposta contam como erradas e a nota é guardada', () => {
    const tree = render();
    press(tree, 'Tempo de prova (45 s por pergunta)');
    press(tree, 'Fazer');
    expect(text(tree)).toContain('⏱ 2:15'); // 3 questões × 45 s
    renderer.act(() => jest.advanceTimersByTime(2 * 60_000 + 20_000));
    expect(text(tree)).toContain('Simulado concluído');
    expect(text(tree)).toContain('O tempo acabou.');
    expect(text(tree)).toContain('3 questões ficaram sem resposta');
    expect(useAiStore.getState().exams[0]?.best).toBe(0);
    expect(useAiStore.getState().exams[0]?.scores).toEqual([0]);
  });

  it('sem tempo, não há cronômetro e a prova não acaba sozinha', () => {
    const tree = render();
    press(tree, 'Fazer');
    expect(text(tree)).not.toContain('⏱');
    renderer.act(() => jest.advanceTimersByTime(60 * 60_000));
    expect(text(tree)).not.toContain('O tempo acabou');
  });
});
