import { StyleSheet } from 'react-native';
import renderer, { type ReactTestInstance } from 'react-test-renderer';
import { ThemeProvider } from '@/theme';
import { Button } from './Button';

// O Reanimated e o Worklets reais precisam de módulos nativos, que não existem no Jest.
jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn() }));

const render = (element: React.ReactElement): ReactTestInstance => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(<ThemeProvider>{element}</ThemeProvider>);
  });
  return tree.root;
};

describe('Button em fileira', () => {
  it('flex e largura vão para o Pressable, que é quem divide a fileira; o visual fica por dentro', () => {
    const root = render(<Button label="Minha voz" style={{ flex: 1, backgroundColor: 'red' }} />);
    const outer = StyleSheet.flatten(root.findAllByProps({ accessibilityRole: 'button' })[0]?.props.style) as Record<string, unknown>;
    expect(outer.flex).toBe(1);
    expect(outer.backgroundColor).toBeUndefined();
  });

  it('sem estilo de layout, o Pressable não ganha flex', () => {
    const root = render(<Button label="Gravar" />);
    const outer = StyleSheet.flatten(root.findAllByProps({ accessibilityRole: 'button' })[0]?.props.style) as Record<string, unknown>;
    expect(outer.flex).toBeUndefined();
  });
});

describe('rótulo falado do botão', () => {
  const { spokenLabel } = require('./Button') as typeof import('./Button');
  it('tira o emoji do começo e nomeia o botão só de emoji', () => {
    expect(spokenLabel('🔊 Ouvir')).toBe('Ouvir');
    expect(spokenLabel('🔊')).toBe('Ouvir');
    expect(spokenLabel('Começar')).toBe('Começar');
  });
});
