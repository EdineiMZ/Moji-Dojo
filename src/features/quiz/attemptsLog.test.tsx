import renderer from 'react-test-renderer';
import { getItem } from '@/features/catalog';
import type { WritingScore } from '@/features/writing/score';
import { useProgressStore } from '@/store';
import { ThemeProvider } from '@/theme';
import type { Question } from './quiz';
import { QuizView } from './QuizView';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn(), feedbackCorrect: jest.fn(), feedbackWrong: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn(), preloadSfx: jest.fn() }));
jest.mock('@/lib/haptics', () => ({ hapticLight: jest.fn() }));
jest.mock('expo-sqlite/kv-store', () => ({ __esModule: true, default: { getItemSync: () => null, setItemSync: jest.fn(), removeItemSync: jest.fn() } }));
jest.mock('@/features/speech/voiceStore', () => ({ speakJapanese: jest.fn() }));
// O quadro de desenho tem gestos e SVG: aqui só importa o que o QuizView faz com a ação que ele devolve.
jest.mock('./WriteQuestion', () => {
  const { View } = require('react-native');
  return { WriteQuestion: (props: { onAction: unknown }) => <View testID="write" onAction={props.onAction} /> };
});

const NOW = new Date(2026, 10, 5, 10, 0, 0).getTime();
const a = getItem('あ');
const i = getItem('い');
const u = getItem('う');
const e = getItem('え');

const score = (pct: number): WritingScore => ({ pct, level: pct >= 80 ? 'ok' : pct >= 60 ? 'warn' : 'bad', strokes: [], expectedCount: 3, drawnCount: 3, verdict: '' });
const writeQuestion = (retry = false): Question => ({ item: a, direction: 'write', options: [], retry });
const choiceQuestion = (direction: 'k2r' | 'r2k' | 'audio'): Question => ({ item: a, direction, options: [a, i, u, e], retry: false });

const mounted: renderer.ReactTestRenderer[] = [];
const show = (questions: Question[]) => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(
      <ThemeProvider>
        <QuizView questions={questions} title="Teste" onDone={jest.fn()} />
      </ThemeProvider>,
    );
  });
  mounted.push(tree);
  return tree;
};
const action = (tree: renderer.ReactTestRenderer, act: unknown) => {
  const pad = tree.root.findAll((n) => n.props.testID === 'write')[0]!;
  renderer.act(() => pad.props.onAction(act));
};
const attempts = () => useProgressStore.getState().attempts;

beforeEach(() => {
  jest.useFakeTimers({ now: NOW });
  // あ na caixa 3: a nota mínima do desenho é 60.
  useProgressStore.setState({ srs: { あ: { b: 3, due: NOW } }, attempts: [] });
});
afterEach(() => {
  renderer.act(() => mounted.splice(0).forEach((t) => t.unmount()));
  jest.useRealTimers();
});

describe('registro de tentativas no QuizView', () => {
  it('desenho reprovado: guarda o tipo write, a nota e o corte vigente', () => {
    action(show([writeQuestion()]), { kind: 'check', score: score(45), hinted: false, drawing: [] });
    expect(attempts()).toEqual([{ c: 'あ', k: 'write', ok: false, t: NOW, n: 45, p: 60 }]);
  });

  it('desenho aprovado: ok = true, com a nota', () => {
    action(show([writeQuestion()]), { kind: 'check', score: score(82), hinted: false, drawing: [] });
    expect(attempts()).toEqual([{ c: 'あ', k: 'write', ok: true, t: NOW, n: 82, p: 60 }]);
  });

  it('a nota "quase lá" (logo abaixo do corte) fica registrada, para separar de um erro de verdade', () => {
    action(show([writeQuestion()]), { kind: 'check', score: score(58), hinted: false, drawing: [] });
    expect(attempts()[0]).toMatchObject({ ok: false, n: 58, p: 60 });
  });

  it('"Não lembro": registra a desistência, sem nota', () => {
    action(show([writeQuestion()]), { kind: 'giveUp' });
    expect(attempts()).toEqual([{ c: 'あ', k: 'write', ok: false, t: NOW, g: 1 }]);
  });

  it('desenho com a dica ligada fica marcado', () => {
    action(show([writeQuestion()]), { kind: 'check', score: score(90), hinted: true, drawing: [] });
    expect(attempts()[0]).toMatchObject({ k: 'write', h: 1, n: 90 });
  });

  it('a pergunta que volta depois do erro é marcada como repetição', () => {
    action(show([writeQuestion(true)]), { kind: 'check', score: score(75), hinted: false, drawing: [] });
    expect(attempts()[0]).toMatchObject({ r: 1, ok: true });
  });

  it.each(['k2r', 'r2k', 'audio'] as const)('escolha %s: guarda o tipo, sem nota', (direction) => {
    const tree = show([choiceQuestion(direction)]);
    const label = direction === 'k2r' ? 'a' : 'あ';
    const press = (text: string) => {
      const button = tree.root.findAll((n) => n.props.label === text && typeof n.props.onPress === 'function')[0]!;
      renderer.act(() => button.props.onPress());
    };
    press(direction === 'audio' ? 'あ' : label);
    expect(attempts()).toHaveLength(1);
    expect(attempts()[0]).toEqual({ c: 'あ', k: direction, ok: true, t: NOW });
  });

  it('erro numa escolha: ok = false', () => {
    const tree = show([choiceQuestion('k2r')]);
    const button = tree.root.findAll((n) => n.props.label === 'i' && typeof n.props.onPress === 'function')[0]!;
    renderer.act(() => button.props.onPress());
    expect(attempts()).toEqual([{ c: 'あ', k: 'k2r', ok: false, t: NOW }]);
  });

  it('o registro não mexe em estatísticas nem no agendamento', () => {
    const before = JSON.stringify([useProgressStore.getState().srs, useProgressStore.getState().stats]);
    action(show([writeQuestion()]), { kind: 'check', score: score(45), hinted: false, drawing: [] });
    expect(JSON.stringify([useProgressStore.getState().srs, useProgressStore.getState().stats])).toBe(before);
  });
});
