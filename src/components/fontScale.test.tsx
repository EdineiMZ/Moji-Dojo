import { PixelRatio, Text } from 'react-native';
import renderer, { type ReactTestInstance } from 'react-test-renderer';
import { ThemeProvider } from '@/theme';
import { ChipRow } from './ChipRow';
import { Skeleton } from './Skeleton';
import { GuideView } from '@/features/keyboard/GuideView';

// O Reanimated e o Worklets reais precisam de módulos nativos, que não existem no Jest.
jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn() }));

const render = (element: React.ReactElement): ReactTestInstance => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(<ThemeProvider>{element}</ThemeProvider>);
  });
  return tree.root;
};

/** Os Text de fora (os de dentro herdam o limite do pai). */
const outerTexts = (root: ReactTestInstance) =>
  root.findAllByType(Text).filter((t) => {
    for (let p = t.parent; p; p = p.parent) if (p.type === Text) return false;
    return true;
  });

describe('fonte grande do sistema (1,5× e 2×)', () => {
  afterEach(() => jest.restoreAllMocks());

  it.each([1.5, 2])('com a fonte a %s×, os textos de chips, guia do flick e esqueleto têm teto de escala', (scale) => {
    jest.spyOn(PixelRatio, 'getFontScale').mockReturnValue(scale);
    const screens: [string, React.ReactElement][] = [
      ['ChipRow', <ChipRow key="c" wrap options={[{ value: 'a', label: 'Apresentação e básico' }, { value: 'b', label: '🔊 Ouvir' }]} value="a" onChange={() => {}} />],
      ['GuideView', <GuideView key="g" onPractice={() => {}} />],
      ['Skeleton', <Skeleton key="s" />],
    ];
    for (const [name, element] of screens) {
      const texts = outerTexts(render(element));
      const unlimited = texts.filter((t) => t.props.allowFontScaling !== false && typeof t.props.maxFontSizeMultiplier !== 'number');
      expect({ name, unlimited: unlimited.length }).toEqual({ name, unlimited: 0 });
    }
  });

  it('a tecla do guia do flick limita a escala do caractere e do rótulo a 1,2×', () => {
    const texts = outerTexts(render(<GuideView onPractice={() => {}} />));
    const keyTexts = texts.filter((t) => t.props.maxFontSizeMultiplier === 1.2);
    expect(keyTexts.length).toBeGreaterThan(0);
  });
});
