import { act, create } from 'react-test-renderer';
import { useSettingsStore } from '@/store';
import { JpInline } from './JpText';

jest.mock('expo-sqlite/kv-store', () => ({ __esModule: true, default: { getItemSync: () => null, setItemSync: jest.fn(), removeItemSync: jest.fn() } }));

const textOf = (mode: 'always' | 'tap' | 'never'): string => {
  useSettingsStore.setState({ romajiMode: mode });
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(<JpInline text="Veja かれは すき" />);
  });
  return JSON.stringify(tree.toJSON());
};

describe('japonês nos textos de explicação', () => {
  it('mostra o romaji sempre, só depois do toque, ou nunca, conforme o ajuste', () => {
    expect(textOf('always')).toContain('kare wa suki');
    expect(textOf('tap')).not.toContain('kare wa suki');
    expect(textOf('never')).not.toContain('kare wa suki');
  });
});
