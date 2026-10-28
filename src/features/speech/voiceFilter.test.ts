import { filterInstalled, filterPacks } from './voiceFilter';
import { installedSpeakers, orderedPacks } from './voicevoxPacks';

describe('busca e favoritos das vozes', () => {
  const voices = installedSpeakers(['0.vvm']);

  it('sem busca, devolve todos; com busca, só os que casam', () => {
    expect(filterInstalled(voices, '', [], false)).toHaveLength(voices.length);
    const found = filterInstalled(voices, 'zunda', [], false);
    expect(found.map((v) => v.info.slug)).toEqual(['zundamon']);
    expect(filterInstalled(voices, 'zzzz', [], false)).toEqual([]);
  });

  it('acha pela descrição em português', () => {
    const found = filterInstalled(voices, 'infantil', [], false);
    expect(found.map((v) => v.info.slug)).toContain('zundamon');
  });

  it('os favoritos vêm primeiro e o filtro "só favoritas" esconde o resto', () => {
    const fav = voices[voices.length - 1]!.info.slug;
    const ordered = filterInstalled(voices, '', [fav], false);
    expect(ordered[0]!.info.slug).toBe(fav);
    expect(ordered).toHaveLength(voices.length);
    expect(filterInstalled(voices, '', [fav], true).map((v) => v.info.slug)).toEqual([fav]);
    expect(filterInstalled(voices, '', [], true)).toEqual([]);
  });

  it('a busca de arquivos acha o arquivo do personagem, e todos os arquivos sem busca', () => {
    expect(filterPacks('', [])).toHaveLength(orderedPacks().length);
    const packs = filterPacks('zundamon', []);
    expect(packs.map((p) => p.file)).toContain('0.vvm');
    expect(packs.length).toBeLessThan(orderedPacks().length);
  });
});
