import renderer, { type ReactTestInstance } from 'react-test-renderer';
import { useSettingsStore } from '@/store';
import { ThemeProvider } from '@/theme';
import { MyVoices } from './MyVoices';
import { VoicePacks } from './VoicePacks';
import { useVoicevoxStore } from './voicevox';
import { packByFile } from './voicevoxPacks';

jest.mock('react-native-worklets', () => require('react-native-worklets/lib/module/mock'));
jest.mock('react-native-reanimated', () => ({ ...require('react-native-reanimated/mock'), useReducedMotion: () => false }));
jest.mock('@/lib/feedback', () => ({ feedbackTap: jest.fn() }));
jest.mock('@/lib/sfx', () => ({ playSfx: jest.fn(), preloadSfx: jest.fn() }));
jest.mock('@/lib/haptics', () => ({ hapticLight: jest.fn() }));
// O áudio nativo (expo-audio) precisa de módulos que não existem no Jest; as telas só chamam a função de tocar.
jest.mock('./nativeAudio', () => ({ playFile: jest.fn(() => true) }));
jest.mock('expo-sqlite/kv-store', () => {
  const data = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItemSync: (k: string) => data.get(k) ?? null,
      setItemSync: (k: string, v: string) => void data.set(k, v),
      removeItemSync: (k: string) => void data.delete(k),
    },
  };
});

const mounted: renderer.ReactTestRenderer[] = [];

const render = (element: React.ReactElement): renderer.ReactTestRenderer => {
  let tree!: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(<ThemeProvider>{element}</ThemeProvider>);
  });
  mounted.push(tree);
  return tree;
};

/** O texto visível da tela, como a pessoa lê (os pedaços de cada frase juntos). */
function flat(node: unknown): string {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flat).join('');
  return flat((node as { children?: unknown }).children);
}

const text = (tree: renderer.ReactTestRenderer): string => flat(tree.toJSON());

/** Os botões (com onPress) cujo texto é exatamente `label`, na ordem da tela. */
function buttons(tree: renderer.ReactTestRenderer, label: string): ReactTestInstance[] {
  const found: ReactTestInstance[] = [];
  for (const node of tree.root.findAll((n) => typeof n.type === 'string' && n.props.children === label)) {
    let current: ReactTestInstance | null = node;
    while (current && typeof current.props.onPress !== 'function') current = current.parent;
    if (current && !found.includes(current)) found.push(current);
  }
  return found;
}

const press = (tree: renderer.ReactTestRenderer, label: string, index = 0) => {
  const target = buttons(tree, label)[index];
  if (!target) throw new Error(`Botão "${label}" não encontrado`);
  renderer.act(() => target.props.onPress());
};

const pack = packByFile('0.vvm')!;
const downloadPack = jest.fn();

afterEach(() => {
  // Desmonta as telas do teste anterior, senão o store as atualiza fora do act().
  renderer.act(() => {
    for (const tree of mounted.splice(0)) tree.unmount();
  });
});

beforeEach(() => {
  downloadPack.mockReset();
  useVoicevoxStore.setState({ installed: [], partial: {}, download: null, packError: '', network: 'unknown', downloadPack });
  useSettingsStore.setState({ voiceEngine: 'system', voicevoxStyle: 99 });
});

describe('lista de vozes para baixar', () => {
  it('"Baixar" abre o aviso de termos, com o link de cada personagem do arquivo, e ainda não baixa nada', () => {
    const tree = render(<VoicePacks />);
    expect(text(tree)).toContain('Baixar 57 MB');
    press(tree, 'Baixar 57 MB');
    const all = text(tree);
    expect(all).toContain('Antes de baixar, aceite os termos');
    for (const name of ['Shikoku Metan', 'Zundamon', 'Kasukabe Tsumugi', 'Amehare Hau']) expect(all).toContain(`Termos de ${name}`);
    expect(all).toContain('Termos gerais das vozes');
    expect(downloadPack).not.toHaveBeenCalled();
  });

  it('só o "Li e aceito..." começa o download, e ele vale para aquele arquivo', () => {
    const tree = render(<VoicePacks />);
    press(tree, 'Baixar 57 MB');
    press(tree, 'Li e aceito os termos de Shikoku Metan, Zundamon, Kasukabe Tsumugi, Amehare Hau e quero baixar');
    expect(downloadPack).toHaveBeenCalledTimes(1);
    expect(downloadPack).toHaveBeenCalledWith('0.vvm', true);
    expect(text(tree)).not.toContain('Antes de baixar, aceite os termos');
  });

  it('"Cancelar" fecha o aviso sem baixar', () => {
    const tree = render(<VoicePacks />);
    press(tree, 'Baixar 57 MB');
    press(tree, 'Cancelar');
    expect(downloadPack).not.toHaveBeenCalled();
    expect(text(tree)).not.toContain('Antes de baixar, aceite os termos');
    expect(text(tree)).toContain('Baixar 57 MB');
  });

  it('em dados móveis, o aviso mostra quanto o download gasta do plano', () => {
    useVoicevoxStore.setState({ network: 'cellular', refreshNetwork: jest.fn() });
    const tree = render(<VoicePacks />);
    press(tree, 'Baixar 57 MB');
    expect(text(tree)).toMatch(/dados móveis.*57 MB/);
  });

  it('um download interrompido vira "Continuar", mostra o que já veio e retoma sem pedir o aceite de novo', () => {
    useVoicevoxStore.setState({ partial: { '0.vvm': Math.floor(pack.bytes / 2) } });
    const tree = render(<VoicePacks />);
    expect(text(tree)).toContain('Continuar (50%)');
    expect(text(tree)).toContain('Download interrompido');
    press(tree, 'Continuar (50%)');
    expect(downloadPack).toHaveBeenCalledWith('0.vvm', true);
    expect(text(tree)).not.toContain('Antes de baixar, aceite os termos');
  });

  it('um arquivo já baixado mostra "baixada" e "Apagar", e não oferece baixar de novo', () => {
    useVoicevoxStore.setState({ installed: ['0.vvm'] });
    const tree = render(<VoicePacks />);
    expect(text(tree)).toContain('baixada ✓');
    expect(buttons(tree, 'Apagar')).toHaveLength(1);
    expect(buttons(tree, 'Baixar 57 MB')).toHaveLength(0);
  });

  it('mostra o erro do último download', () => {
    useVoicevoxStore.setState({ packError: 'Não consegui baixar a voz: A conexão caiu.' });
    expect(text(render(<VoicePacks />))).toContain('A conexão caiu.');
  });
});

describe('minhas vozes', () => {
  it('sem nenhuma voz baixada, não aparece', () => {
    expect(render(<MyVoices />).toJSON()).toBeNull();
  });

  it('lista os personagens baixados com a descrição e o espaço usado', () => {
    useVoicevoxStore.setState({ installed: ['0.vvm'] });
    const all = text(render(<MyVoices />));
    expect(all).toContain('MINHAS VOZES');
    expect(all).toContain('Zundamon (ずんだもん)');
    expect(all).toContain('Voz aguda e infantil');
    expect(all).toContain('1 arquivo');
    expect(all).toContain('57 MB');
  });

  it('"Usar" escolhe o personagem e já liga o VOICEVOX, com o selo "Em uso"', () => {
    useVoicevoxStore.setState({ installed: ['0.vvm'] });
    const tree = render(<MyVoices />);
    expect(buttons(tree, 'Usar')).toHaveLength(4);
    press(tree, 'Usar', 1); // Zundamon é o segundo do arquivo
    expect(useSettingsStore.getState().voiceEngine).toBe('voicevox');
    expect(useSettingsStore.getState().voicevoxStyle).toBe(3);
    expect(text(tree)).toContain('✓ Em uso');
    expect(buttons(tree, 'Usar')).toHaveLength(3);
  });

  it('"Voltar para a voz do Android" desliga o VOICEVOX', () => {
    useVoicevoxStore.setState({ installed: ['0.vvm'] });
    useSettingsStore.setState({ voiceEngine: 'voicevox', voicevoxStyle: 3 });
    const tree = render(<MyVoices />);
    press(tree, 'Voltar para a voz do Android');
    expect(useSettingsStore.getState().voiceEngine).toBe('system');
  });

  it('favoritar um personagem guarda o favorito e o filtro "Favoritas" mostra só ele', () => {
    useVoicevoxStore.setState({ installed: ['0.vvm'] });
    useSettingsStore.setState({ favoriteVoices: [] });
    const tree = render(<MyVoices />);
    const star = tree.root.findAll((n) => typeof n.props.onPress === 'function' && String(n.props.accessibilityLabel ?? '').startsWith('Favoritar ずんだもん'))[0]!;
    renderer.act(() => star.props.onPress());
    expect(useSettingsStore.getState().favoriteVoices).toEqual(['zundamon']);
    press(tree, '★ Favoritas (1)');
    expect(buttons(tree, 'Usar')).toHaveLength(1);
  });

  it('a altura, a entonação e a voz do atendente são escolhidas ali mesmo', () => {
    useVoicevoxStore.setState({ installed: ['0.vvm'] });
    useSettingsStore.setState({ voicevoxPitch: 0, voicevoxIntonation: 1, voicevoxStaffStyle: null });
    const tree = render(<MyVoices />);
    press(tree, 'Mais aguda');
    press(tree, 'Expressiva');
    expect(useSettingsStore.getState().voicevoxPitch).toBe(0.1);
    expect(useSettingsStore.getState().voicevoxIntonation).toBe(1.3);
    press(tree, 'Shikoku Metan (四国めたん)');
    expect(useSettingsStore.getState().voicevoxStaffStyle).toBe(2);
    press(tree, 'A mesma voz');
    expect(useSettingsStore.getState().voicevoxStaffStyle).toBeNull();
  });
});
