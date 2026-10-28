import { DEFAULT_VOICEVOX_STYLE } from '@/store/settingsStore';
import { VOICE_PACKS, VOICE_SPEAKERS } from './voicevoxCatalog';
import {
  RECOMMENDED_PACK,
  formatSize,
  installedBytes,
  downloadWarning,
  installedSpeakers,
  partialPercent,
  orderedPacks,
  packByFile,
  packForStyle,
  packSpeakers,
  packStyleIds,
  packUrl,
  requiredFreeBytes,
  speakerInfo,
} from './voicevoxPacks';
import { parseSampleUrl } from './voicevoxSample';
import { STYLE_PT, VOICE_DESC_PT, romanName, speakerLabel, styleLabel } from './voicevoxText';

describe('catálogo de vozes', () => {
  it('tem só arquivos de fala com nome válido, sem repetir', () => {
    const files = VOICE_PACKS.map((p) => p.file);
    expect(new Set(files).size).toBe(files.length);
    for (const file of files) expect(file).toMatch(/^\d{1,3}\.vvm$/);
  });

  it('cada arquivo tem tamanho, personagens e estilos', () => {
    for (const pack of VOICE_PACKS) {
      expect(pack.bytes).toBeGreaterThan(10 * 1048576);
      expect(packSpeakers(pack).length).toBeGreaterThan(0);
      expect(packStyleIds(pack).length).toBeGreaterThan(0);
    }
  });

  it('nenhum estilo está em dois arquivos (assim cada voz sabe o que baixar)', () => {
    const styles = VOICE_PACKS.flatMap(packStyleIds);
    expect(new Set(styles).size).toBe(styles.length);
  });

  it('o arquivo recomendado traz o estilo padrão do app (ずんだもん ノーマル)', () => {
    expect(packForStyle(DEFAULT_VOICEVOX_STYLE)?.file).toBe(RECOMMENDED_PACK);
    expect(packSpeakers(packByFile(RECOMMENDED_PACK)!)).toContain('ずんだもん');
  });
});

describe('personagens do site oficial', () => {
  const inPacks = new Set(VOICE_PACKS.flatMap(packSpeakers));

  it('todo personagem de um arquivo tem a página do site, e vice-versa', () => {
    for (const name of inPacks) expect(speakerInfo(name)).toBeDefined();
    for (const s of VOICE_SPEAKERS) expect(inPacks.has(s.name)).toBe(true);
  });

  it('cada personagem tem endereço único e link de termos próprio', () => {
    const slugs = VOICE_SPEAKERS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of VOICE_SPEAKERS) {
      expect(s.slug).toMatch(/^[a-z_0-9]+$/);
      // Os termos são das páginas de cada autor; a de 波音リツ é http, como no TERMS.txt oficial.
      expect(s.termsUrl).toMatch(/^https?:\/\//);
    }
  });

  it('todo personagem tem a descrição em português (vazia só quando o site ainda não descreve)', () => {
    for (const s of VOICE_SPEAKERS) {
      expect(VOICE_DESC_PT).toHaveProperty(s.slug);
      if (s.voiceJa.length > 1) expect(VOICE_DESC_PT[s.slug]?.length).toBeGreaterThan(5);
    }
  });

  it('todo estilo de voz tem o nome em português', () => {
    const names = new Set(VOICE_PACKS.flatMap((p) => p.voices.flatMap((v) => v.styles.map(([, name]) => name))));
    const missing = [...names].filter((n) => !(n in STYLE_PT));
    expect(missing).toEqual([]);
  });
});

describe('nomes traduzidos', () => {
  it('romaniza pelo endereço oficial, com as exceções', () => {
    expect(romanName('kasukabe_tsumugi')).toBe('Kasukabe Tsumugi');
    expect(romanName('zundamon')).toBe('Zundamon');
    expect(romanName('number_seven')).toBe('No.7');
    expect(romanName('mochikosan')).toBe('Mochiko-san');
  });

  it('mostra romaji e japonês, sem repetir nomes que já são em letras latinas', () => {
    expect(speakerLabel('ずんだもん', 'zundamon')).toBe('Zundamon (ずんだもん)');
    expect(speakerLabel('WhiteCUL', 'white_cul')).toBe('WhiteCUL');
    expect(speakerLabel('No.7', 'number_seven')).toBe('No.7');
  });

  it('traduz o estilo e, sem tradução, devolve o original', () => {
    expect(styleLabel('あまあま')).toBe('Doce');
    expect(styleLabel('estilo-novo')).toBe('estilo-novo');
  });
});

describe('amostra do site oficial', () => {
  // Trecho no formato real da página (JSON dentro do HTML, com aspas escapadas).
  const page = (talk: string) =>
    `<astro-island props="{&quot;talkVoiceAudios&quot;:[1,[[0,{&quot;style&quot;:[0,&quot;ノーマル&quot;],&quot;urls&quot;:[1,[[0,&quot;${talk}&quot;],[0,&quot;/_astro/x-normal-002.B.wav&quot;]]]}]]],&quot;songVoiceAudios&quot;:[1,[[0,{&quot;urls&quot;:[1,[[0,&quot;/_astro/x-humming-001.C.wav&quot;]]]}]]]}">`;

  it('lê o endereço da primeira amostra de fala e o completa com o site', () => {
    expect(parseSampleUrl(page('/_astro/zundamon-normal-001.DlxPrwB-.wav'))).toBe('https://voicevox.hiroshiba.jp/_astro/zundamon-normal-001.DlxPrwB-.wav');
  });

  it('ignora a amostra de canto e devolve null quando a página mudou', () => {
    expect(parseSampleUrl(page('/_astro/a.wav'))).not.toContain('humming');
    expect(parseSampleUrl('<html>sem dados</html>')).toBeNull();
    expect(parseSampleUrl('"talkVoiceAudios":[1,[]]')).toBeNull();
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

describe('minhas vozes (personagens já baixados)', () => {
  it('sem nenhuma voz baixada, não há personagem', () => {
    expect(installedSpeakers([])).toEqual([]);
    expect(installedSpeakers(['999.vvm'])).toEqual([]);
  });

  it('lista os personagens do arquivo baixado, na ordem do catálogo', () => {
    const names = installedSpeakers(['0.vvm']).map((v) => v.info.name);
    expect(names).toEqual(['四国めたん', 'ずんだもん', '春日部つむぎ', '雨晴はう']);
  });

  it('junta os tons do mesmo personagem que está em mais de um arquivo, sem repetir o personagem', () => {
    const one = installedSpeakers(['0.vvm']).find((v) => v.info.name === 'ずんだもん')!;
    const all = installedSpeakers(['0.vvm', '5.vvm', '15.vvm']);
    const zunda = all.find((v) => v.info.name === 'ずんだもん')!;
    expect(all.filter((v) => v.info.name === 'ずんだもん')).toHaveLength(1);
    expect(zunda.styles.length).toBeGreaterThan(one.styles.length);
    const ids = zunda.styles.map(([id]) => id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain(3); // ノーマル, do 0.vvm
    expect(ids).toContain(22); // ささやき, do 5.vvm
    expect(ids).toContain(75); // ヘロヘロ, do 15.vvm
  });
});

describe('download das vozes', () => {
  it('todo arquivo tem o SHA-256 oficial (64 caracteres hexadecimais) e ele é único', () => {
    const hashes = VOICE_PACKS.map((p) => p.sha256);
    for (const h of hashes) expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(new Set(hashes).size).toBe(hashes.length);
  });

  it('o hash do arquivo recomendado é o que a release publica e que conferimos no 0.vvm baixado', () => {
    expect(packByFile('0.vvm')?.sha256).toBe('ecd35374d4182cd883cba5040376f7f888cc6ba248b1c2f4cea07cdb34bb1318');
  });

  it('mostra quanto de um download interrompido já veio, sem passar de 100', () => {
    const pack = packByFile('0.vvm')!;
    expect(partialPercent(0, pack)).toBe(0);
    expect(partialPercent(pack.bytes / 2, pack)).toBe(50);
    expect(partialPercent(pack.bytes * 3, pack)).toBe(100);
    expect(partialPercent(-5, pack)).toBe(0);
  });

  it('avisa quando o download gastaria dados móveis ou quando não há internet', () => {
    expect(downloadWarning('wifi', 57 * 1048576)).toBeNull();
    expect(downloadWarning('unknown', 57 * 1048576)).toBeNull();
    expect(downloadWarning('cellular', 57 * 1048576)).toMatch(/dados móveis.*57 MB/);
    expect(downloadWarning('none', 57 * 1048576)).toMatch(/Sem internet/);
  });
});
