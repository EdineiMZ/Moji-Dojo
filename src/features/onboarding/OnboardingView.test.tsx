import renderer from 'react-test-renderer';
import { ThemeProvider } from '@/theme';
import { OnboardingView } from './OnboardingView';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn(), preloadSfx: jest.fn() }));
jest.mock('@/features/reminders/scheduler', () => ({ requestPermission: jest.fn(async () => true) }));

const all = (tree: renderer.ReactTestRenderer): string => JSON.stringify(tree.toJSON());

describe('tela de introdução', () => {
  it('abre pedindo o nome, com o botão de continuar travado até ter um nome', () => {
    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(
        <ThemeProvider>
          <OnboardingView onFinish={jest.fn()} />
        </ThemeProvider>,
      );
    });
    const text = all(tree);
    expect(text).toContain('Bem-vindo ao Moji Dojo!');
    expect(text).toContain('Como posso te chamar?');
    expect(text).toContain('Pular a introdução');
    const buttons = tree.root.findAll((n) => n.props.accessibilityRole === 'button' && n.props.accessibilityLabel === 'Continuar');
    expect(buttons[0]?.props.disabled).toBe(true);
  });
});
