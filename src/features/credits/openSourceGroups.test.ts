import { NOTICE_TEXTS, OPEN_SOURCE } from '@/content/openSource';
import { ONNX_NOTICES } from '@/content/openSourceOnnx';
import { groupByLicense, noticeLink } from './openSourceGroups';

describe('licenças de código aberto', () => {
  it('toda licença tem o texto, ou um link quando os termos não são livres', () => {
    for (const item of OPEN_SOURCE) {
      if (item.text !== null) {
        expect(NOTICE_TEXTS[item.text]).toBeTruthy();
        expect(NOTICE_TEXTS[item.text]!.length).toBeGreaterThan(80);
      } else {
        expect(noticeLink(item)).toMatch(/^https:\/\//);
      }
    }
  });

  it('nenhum componente ficou sem licença identificada', () => {
    expect(OPEN_SOURCE.filter((i) => i.license === 'desconhecida')).toEqual([]);
  });

  it('inclui os componentes nativos que o APK carrega e os pacotes que o app usa de fato', () => {
    const names = OPEN_SOURCE.map((i) => i.name);
    for (const required of ['VOICEVOX CORE', 'ONNX Runtime (build do VOICEVOX)', 'Dicionário do Open JTalk (NAIST)', 'react-native', 'expo', 'zustand', 'react-native-reanimated', '@expo-google-fonts/m-plus-rounded-1c']) {
      expect(names).toContain(required);
    }
  });

  it('os avisos do Open JTalk e do VOICEVOX CORE trazem o copyright de quem os escreveu', () => {
    const textOf = (name: string) => NOTICE_TEXTS[OPEN_SOURCE.find((i) => i.name === name)!.text!]!;
    expect(textOf('Dicionário do Open JTalk (NAIST)')).toContain('Nara Institute of Science and Technology');
    expect(textOf('VOICEVOX CORE')).toContain('Hiroshiba Kazuyuki');
    expect(textOf('ONNX Runtime (build do VOICEVOX)')).toContain('Microsoft Corporation');
  });

  it('agrupa por licença sem perder nem repetir componente, com a mais comum primeiro', () => {
    const groups = groupByLicense(OPEN_SOURCE);
    expect(groups.reduce((n, g) => n + g.items.length, 0)).toBe(OPEN_SOURCE.length);
    const counts = groups.map((g) => g.items.length);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  it('os avisos de terceiros do ONNX Runtime vêm completos e em trechos curtos', () => {
    expect(ONNX_NOTICES.length).toBeGreaterThan(50);
    expect(ONNX_NOTICES.join('\n')).toContain('Microsoft Corporation');
    expect(Math.max(...ONNX_NOTICES.map((c) => c.length))).toBeLessThan(40000);
  });
});
