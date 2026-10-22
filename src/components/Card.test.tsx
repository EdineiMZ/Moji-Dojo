import { StyleSheet } from 'react-native';
import renderer, { type ReactTestInstance } from 'react-test-renderer';
import { ThemeProvider } from '@/theme';
import { Card } from './Card';

// O Reanimated e o Worklets reais precisam de módulos nativos, que não existem no Jest.
jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

/** Props que o Reanimated trata como "animação de layout" (entrada, saída e transição de layout). */
const LAYOUT_ANIMATION_PROPS = ['entering', 'exiting', 'layout'] as const;

/** O próprio `Card` também recebe `layout` como prop, mas só os nós que ele renderiza são animados. */
const hasLayoutAnimation = (node: ReactTestInstance): boolean =>
  node.type !== Card && LAYOUT_ANIMATION_PROPS.some((prop) => node.props[prop] !== undefined);

const flatStyle = (node: ReactTestInstance): Record<string, unknown> =>
  (StyleSheet.flatten(node.props.style) as Record<string, unknown> | undefined) ?? {};

/**
 * Nós em que o Reanimated avisa: "Property 'opacity' ... may be overwritten by a layout animation".
 * Acontece quando o mesmo componente tem animação de layout e `opacity` no estilo.
 */
function nodesThatMixLayoutAnimationAndOpacity(root: ReactTestInstance): ReactTestInstance[] {
  return root.findAll((node) => hasLayoutAnimation(node) && 'opacity' in flatStyle(node));
}

const render = (card: React.ReactElement): ReactTestInstance => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(<ThemeProvider>{card}</ThemeProvider>);
  });
  return tree.root;
};

describe('Card: animação de layout e opacity em níveis separados', () => {
  it('um cartão com estilo de opacity (lição bloqueada) não mistura os dois no mesmo nó', () => {
    const root = render(
      <Card enterIndex={2} style={{ opacity: 0.6 }}>
        {null}
      </Card>,
    );
    expect(nodesThatMixLayoutAnimationAndOpacity(root)).toEqual([]);
  });

  it('a opacity do estilo continua valendo: fica no cartão (nó interno), não se perde', () => {
    const root = render(
      <Card enterIndex={0} style={{ opacity: 0.6 }}>
        {null}
      </Card>,
    );
    const withOpacity = root.findAll((node) => flatStyle(node).opacity === 0.6);
    expect(withOpacity.length).toBeGreaterThan(0);
    // ...e esse nó é justamente o que não tem animação de layout
    expect(withOpacity.every((node) => !hasLayoutAnimation(node))).toBe(true);
  });

  it('a entrada e a transição de layout ficam no nó externo', () => {
    const layout = jest.fn();
    const root = render(
      <Card enterIndex={1} layout={layout as never}>
        {null}
      </Card>,
    );
    const animated = root.findAll(hasLayoutAnimation);
    expect(animated.length).toBeGreaterThan(0);
    for (const node of animated) {
      expect(node.props.entering).toBeDefined();
      expect(node.props.layout).toBe(layout);
    }
  });

  it('sem enterIndex não há animação de entrada', () => {
    const root = render(<Card>{null}</Card>);
    expect(root.findAll((node) => node.props.entering !== undefined)).toEqual([]);
  });
});
