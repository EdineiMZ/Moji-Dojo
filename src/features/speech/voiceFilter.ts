import { matchesSearch } from './voiceTuning';
import type { VoicePack } from './voicevoxCatalog';
import { orderedPacks, speakerInfo, type InstalledSpeaker } from './voicevoxPacks';
import { VOICE_DESC_PT, speakerLabel } from './voicevoxText';

/** Os textos em que a busca olha para um personagem: o nome do app, o nome romanizado, o japonês e a descrição. */
function fieldsOf(speaker: string): string[] {
  const info = speakerInfo(speaker);
  if (!info) return [speaker];
  return [speakerLabel(info.name, info.slug), info.name, info.slug.replace(/_/g, ' '), VOICE_DESC_PT[info.slug] ?? ''];
}

/** Os personagens baixados que casam com a busca, os favoritos primeiro (a ordem de dentro de cada grupo se mantém). */
export function filterInstalled(voices: readonly InstalledSpeaker[], query: string, favorites: readonly string[], onlyFavorites: boolean): InstalledSpeaker[] {
  const kept = voices.filter((v) => (!onlyFavorites || favorites.includes(v.info.slug)) && matchesSearch(query, ...fieldsOf(v.info.name)));
  return [...kept.filter((v) => favorites.includes(v.info.slug)), ...kept.filter((v) => !favorites.includes(v.info.slug))];
}

/** Os arquivos de voz que têm algum personagem que casa com a busca; os que têm favoritos vêm primeiro. */
export function filterPacks(query: string, favorites: readonly string[]): VoicePack[] {
  const hasFavorite = (p: VoicePack) => p.voices.some((v) => favorites.includes(speakerInfo(v.speaker)?.slug ?? ''));
  const kept = orderedPacks().filter((p) => p.voices.some((v) => matchesSearch(query, ...fieldsOf(v.speaker))));
  return [...kept.filter(hasFavorite), ...kept.filter((p) => !hasFavorite(p))];
}
