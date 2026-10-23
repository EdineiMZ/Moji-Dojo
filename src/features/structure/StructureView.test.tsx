import renderer from 'react-test-renderer';
import { ThemeProvider } from '@/theme';
import { StructureView } from './StructureView';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn(), feedbackCorrect: jest.fn(), feedbackWrong: jest.fn(), feedbackComplete: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn(), preloadSfx: jest.fn() }));
jest.mock('@/features/speech/voiceStore', () => ({ speakJapanese: jest.fn() }));

const texts = (tree: renderer.ReactTestRenderer): string =>
  JSON.stringify(tree.toJSON()).match(/"children":\["([^"]*)"\]/g)?.join(' ') ?? '';

describe('tela de Estrutura', () => {
  it('abre com o mapa da frase e as frases de viagem em blocos', () => {
    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(
        <ThemeProvider>
          <StructureView />
        </ThemeProvider>,
      );
    });
    const all = texts(tree);
    expect(all).toContain('O mapa da frase japonesa');
    expect(all).toContain('Ver por dentro');
    expect(all).toContain('Qual é o papel?');
  });
});
