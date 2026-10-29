import renderer, { type ReactTestInstance } from 'react-test-renderer';
import { useShareStore } from '@/features/share/sharedText';
import { ThemeProvider } from '@/theme';
import { AiStudioView } from './AiStudioView';
import { useAiReady } from './useAi';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn(), feedbackCorrect: jest.fn(), feedbackWrong: jest.fn(), feedbackComplete: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn(), preloadSfx: jest.fn() }));
jest.mock('@/lib/haptics', () => ({ hapticLight: jest.fn() }));
jest.mock('@/features/speech/voiceStore', () => ({ speakJapanese: jest.fn() }));
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }), router: { navigate: jest.fn() } }));
jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn(async () => null), setItemAsync: jest.fn(), deleteItemAsync: jest.fn() }));
jest.mock('expo-speech-recognition', () => ({ ExpoSpeechRecognitionModule: {}, useSpeechRecognitionEvent: jest.fn() }));
jest.mock('./useAi', () => ({ useAiReady: jest.fn(() => true), ask: jest.fn() }));
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
        <AiStudioView />
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
const explainInput = (tree: renderer.ReactTestRenderer): ReactTestInstance | undefined => tree.root.findAll((n) => n.props.accessibilityLabel === 'Texto em japonês para explicar' && 'value' in n.props)[0];

afterEach(() => {
  renderer.act(() => {
    for (const tree of mounted.splice(0)) tree.unmount();
  });
  jest.clearAllMocks();
  (useAiReady as jest.Mock).mockReturnValue(true);
  useShareStore.setState({ text: null, nonce: 0 });
});

describe('texto compartilhado de outro app na tela Explicar', () => {
  it('abre em Explicar com o campo preenchido, sem enviar nada à IA, e solta o texto da fila', () => {
    useShareStore.setState({ text: '今日は友だちと京都へ行きます。', nonce: 1 });
    const tree = render();
    expect(text(tree)).toContain('Explicar um texto');
    expect(explainInput(tree)?.props.value).toBe('今日は友だちと京都へ行きます。');
    // O botão "Explicar" existe e só roda quando a pessoa o toca: nenhuma chamada foi feita.
    const { ask } = jest.requireMock('./useAi') as { ask: jest.Mock };
    expect(ask).not.toHaveBeenCalled();
    expect(useShareStore.getState().text).toBeNull();
  });

  it('sem texto compartilhado, abre na Conversa como sempre e o campo de Explicar começa vazio', () => {
    const tree = render();
    expect(text(tree)).not.toContain('Explicar um texto');
    expect(explainInput(tree)).toBeUndefined();
  });

  it('sem a IA pronta, mostra o texto recebido e o guarda para depois', () => {
    (useAiReady as jest.Mock).mockReturnValue(false);
    useShareStore.setState({ text: 'ありがとう', nonce: 1 });
    const tree = render();
    expect(text(tree)).toContain('Texto recebido:');
    expect(text(tree)).toContain('ありがとう');
    expect(useShareStore.getState().text).toBe('ありがとう');
  });
});
