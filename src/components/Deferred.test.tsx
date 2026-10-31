import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@/theme';
import { Deferred } from './Deferred';

// O Reanimated e o Worklets reais precisam de módulos nativos, que não existem no Jest.
jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));

describe('Deferred', () => {
  it('mostra o esqueleto de carregamento primeiro e a lista logo depois', async () => {
    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(
        <ThemeProvider>
          <Deferred>
            <Text>lista pronta</Text>
          </Deferred>
        </ThemeProvider>,
      );
    });
    expect(tree.root.findAllByProps({ accessibilityLabel: 'Carregando' }).length).toBeGreaterThan(0);
    expect(tree.root.findAllByType(Text)).toHaveLength(0);

    await renderer.act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
    expect(tree.root.findAllByProps({ accessibilityLabel: 'Carregando' })).toHaveLength(0);
    expect(tree.root.findByType(Text).props.children).toBe('lista pronta');
  });
});
