import renderer from 'react-test-renderer';
import { getItem } from '@/features/catalog';
import { ThemeProvider } from '@/theme';
import type { WriteResult } from './WriteQuestion';
import { WriteQuestion } from './WriteQuestion';
import { scoreWriting } from '@/features/writing/score';
import { strokeModel } from '@/features/writing/model';
import { flattenPath } from '@/features/strokes/svgPath';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn(), preloadSfx: jest.fn() }));
jest.mock('@/lib/haptics', () => ({ hapticLight: jest.fn() }));
jest.mock('expo-sqlite/kv-store', () => ({ __esModule: true, default: { getItemSync: () => null, setItemSync: jest.fn(), removeItemSync: jest.fn() } }));
jest.mock('@/features/speech/voiceStore', () => ({ speakJapanese: jest.fn() }));
// O quadro de desenho usa gestos e SVG: aqui só importa o que a tela decide ao redor dele.
jest.mock('@/features/writing/DrawingPad', () => {
  const { View } = require('react-native');
  return { DrawingPad: (props: { showModel?: boolean; onStrokeEnd: (s: unknown) => void }) => <View testID={props.showModel ? 'pad-com-modelo' : 'pad'} onStrokeEnd={props.onStrokeEnd} /> };
});
jest.mock('@/features/writing/DrawingPreview', () => {
  const { View } = require('react-native');
  return { DrawingPreview: () => <View testID="preview" /> };
});
jest.mock('@/components/StrokeAnimation', () => {
  const { View } = require('react-native');
  return { StrokeAnimation: () => <View testID="animacao" /> };
});

const mounted: renderer.ReactTestRenderer[] = [];
const render = (el: React.ReactElement) => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(<ThemeProvider>{el}</ThemeProvider>);
  });
  mounted.push(tree);
  return tree;
};
afterEach(() => renderer.act(() => mounted.splice(0).forEach((t) => t.unmount())));

const item = getItem('あ');
const has = (tree: renderer.ReactTestRenderer, text: string) => JSON.stringify(tree.toJSON()).includes(text);
const byTestId = (tree: renderer.ReactTestRenderer, id: string) => tree.root.findAll((n) => n.props.testID === id);
const pressButton = (tree: renderer.ReactTestRenderer, label: string) => {
  const nodes = tree.root.findAll((n) => n.props.label === label && typeof n.props.onPress === 'function' && n.props.disabled !== true);
  if (nodes.length === 0) throw new Error(`sem botão "${label}"`);
  renderer.act(() => nodes[0]!.props.onPress());
};

describe('"Não lembro" (desenho)', () => {
  it('sem resposta ainda: oferece Não lembro e Conferir, e "Não lembro" só envia a desistência (erro), sem nota', () => {
    const onAction = jest.fn();
    const tree = render(<WriteQuestion item={item} result={null} onAction={onAction} />);
    expect(has(tree, 'DESENHE O SÍMBOLO')).toBe(true);
    pressButton(tree, 'Não lembro');
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith({ kind: 'giveUp' });
  });

  it('depois de desistir: mostra a animação da ordem dos traços e que a pergunta volta', () => {
    const tree = render(<WriteQuestion item={item} result={{ kind: 'gaveUp' }} onAction={jest.fn()} />);
    expect(has(tree, 'Veja a ordem dos')).toBe(true);
    expect(has(tree, 'Esta pergunta volta daqui a pouco')).toBe(true);
    expect(byTestId(tree, 'animacao').length).toBeGreaterThan(0);
    expect(byTestId(tree, 'pad')).toHaveLength(0);
  });

  it('o traçado guiado vem com o modelo por baixo, avisa que não vale nota e nunca chama onAction', () => {
    const onAction = jest.fn();
    const tree = render(<WriteQuestion item={item} result={{ kind: 'gaveUp' }} onAction={onAction} />);
    pressButton(tree, 'Traçar por cima');
    expect(has(tree, 'Não vale nota')).toBe(true);
    const pad = byTestId(tree, 'pad-com-modelo');
    expect(pad.length).toBeGreaterThan(0);
    const model = strokeModel('あ')!;
    const stroke = flattenPath(model.p[0] as string).map(([x, y]) => [x, y] as const);
    // tracejar vários traços não dispara nenhuma conferência
    renderer.act(() => pad[0]!.props.onStrokeEnd(stroke));
    renderer.act(() => pad[0]!.props.onStrokeEnd(stroke));
    expect(onAction).not.toHaveBeenCalled();
    // dá para voltar a ver a ordem
    pressButton(tree, 'Ver a ordem');
    expect(has(tree, 'Veja a ordem dos')).toBe(true);
    expect(onAction).not.toHaveBeenCalled();
  });

  it('desfazer e limpar do traçado guiado só aparecem habilitados depois de tracejar', () => {
    const tree = render(<WriteQuestion item={item} result={{ kind: 'gaveUp' }} onAction={jest.fn()} />);
    pressButton(tree, 'Traçar por cima');
    expect(() => pressButton(tree, 'Desfazer')).toThrow();
    const pad = byTestId(tree, 'pad-com-modelo')[0]!;
    renderer.act(() => pad.props.onStrokeEnd([[10, 10], [50, 50]]));
    pressButton(tree, 'Desfazer');
    expect(() => pressButton(tree, 'Limpar')).toThrow();
  });

  it('errar o desenho mostra o seu traço ao lado do certo', () => {
    const model = strokeModel('あ')!;
    const score = scoreWriting(model, []);
    const result: WriteResult = { kind: 'scored', score, correct: false };
    const tree = render(<WriteQuestion item={item} result={result} onAction={jest.fn()} />);
    expect(has(tree, 'SEU DESENHO')).toBe(true);
    expect(has(tree, 'O CERTO')).toBe(true);
    expect(byTestId(tree, 'preview').length).toBeGreaterThan(0);
  });

  it('acertar o desenho não mostra a comparação', () => {
    const model = strokeModel('あ')!;
    const result: WriteResult = { kind: 'scored', score: scoreWriting(model, []), correct: true };
    const tree = render(<WriteQuestion item={item} result={result} onAction={jest.fn()} />);
    expect(has(tree, 'SEU DESENHO')).toBe(false);
  });
});
