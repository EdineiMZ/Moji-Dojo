import { DEFAULT_VOICEVOX_STYLE } from '@/store/settingsStore';
import { VOICE_PACKS } from './voicevoxCatalog';
import { RECOMMENDED_PACK, formatSize, installedBytes, orderedPacks, packByFile, packForStyle, packUrl, requiredFreeBytes } from './voicevoxPacks';

describe('catálogo de vozes', () => {
  it('tem só arquivos de fala com nome válido, sem repetir', () => {
    const files = VOICE_PACKS.map((p) => p.file);
    expect(new Set(files).size).toBe(files.length);
    for (const file of files) expect(file).toMatch(/^\d{1,3}\.vvm$/);
  });

  it('cada arquivo tem tamanho, personagens e estilos', () => {
    for (const pack of VOICE_PACKS) {
      expect(pack.bytes).toBeGreaterThan(10 * 1048576);
      expect(pack.speakers.length).toBeGreaterThan(0);
      expect(pack.styles.length).toBeGreaterThan(0);
    }
  });

  it('nenhum estilo está em dois arquivos (assim cada voz sabe o que baixar)', () => {
    const styles = VOICE_PACKS.flatMap((p) => p.styles);
    expect(new Set(styles).size).toBe(styles.length);
  });

  it('o arquivo recomendado traz o estilo padrão do app (ずんだもん ノーマル)', () => {
    expect(packForStyle(DEFAULT_VOICEVOX_STYLE)?.file).toBe(RECOMMENDED_PACK);
    expect(packByFile(RECOMMENDED_PACK)?.speakers).toContain('ずんだもん');
  });
});

describe('ajudantes das vozes', () => {
  it('monta o endereço da release oficial', () => {
    expect(packUrl('0.vvm')).toBe('https://github.com/VOICEVOX/voicevox_vvm/releases/download/0.17.0/0.vvm');
  });

  it('põe o recomendado primeiro e não perde nenhum arquivo', () => {
    const ordered = orderedPacks();
    expect(ordered[0]?.file).toBe(RECOMMENDED_PACK);
    expect(ordered).toHaveLength(VOICE_PACKS.length);
  });

  it('formata o tamanho em MB e soma o que já foi baixado, ignorando nomes desconhecidos', () => {
    expect(formatSize(59308488)).toBe('57 MB');
    expect(installedBytes(['0.vvm', 'x.vvm'])).toBe(packByFile('0.vvm')?.bytes);
    expect(installedBytes([])).toBe(0);
  });

  it('exige uma folga de espaço além do arquivo', () => {
    const pack = packByFile('0.vvm');
    expect(pack && requiredFreeBytes(pack)).toBeGreaterThan(pack?.bytes ?? 0);
  });
});
