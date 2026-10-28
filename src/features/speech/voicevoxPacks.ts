import { VOICE_PACKS, VOICE_PACKS_RELEASE, VOICE_SPEAKERS, type VoicePack, type VoiceSpeaker } from './voicevoxCatalog';

/** O arquivo que traz ずんだもん, 四国めたん, 春日部つむぎ e 雨晴はう: o que o app sugere baixar primeiro. */
export const RECOMMENDED_PACK = '0.vvm';

/** Termos de uso gerais das vozes, no repositório oficial (os de cada personagem estão em `speakerInfo(...).termsUrl`). */
export const VOICEVOX_TERMS_URL = 'https://github.com/VOICEVOX/voicevox_vvm/blob/main/TERMS.txt';

/** Onde cada arquivo é baixado: a release oficial, direto para o aparelho (o app não tem servidor). */
export const packUrl = (file: string): string => `https://github.com/VOICEVOX/voicevox_vvm/releases/download/${VOICE_PACKS_RELEASE}/${file}`;

export const packByFile = (file: string): VoicePack | undefined => VOICE_PACKS.find((p) => p.file === file);

/** Os personagens de um arquivo (em japonês, como no motor). */
export const packSpeakers = (pack: VoicePack): string[] => pack.voices.map((v) => v.speaker);

/** Os ids de todos os estilos de um arquivo. */
export const packStyleIds = (pack: VoicePack): number[] => pack.voices.flatMap((v) => v.styles.map(([id]) => id));

/** O arquivo que contém um estilo (personagem + tom), para saber o que baixar para usar aquela voz. */
export const packForStyle = (styleId: number): VoicePack | undefined => VOICE_PACKS.find((p) => packStyleIds(p).includes(styleId));

/** Os dados do site oficial de um personagem (endereço, descrição em japonês, termos). */
export const speakerInfo = (name: string): VoiceSpeaker | undefined => VOICE_SPEAKERS.find((s) => s.name === name);

/** Um personagem das vozes já baixadas, com os tons de todos os arquivos baixados juntos (ずんだもん tem tons em 3 arquivos). */
export interface InstalledSpeaker {
  info: VoiceSpeaker;
  styles: readonly (readonly [number, string])[];
}

/** Os personagens que a pessoa já pode usar, na ordem do catálogo, sem repetir quem aparece em mais de um arquivo. */
export function installedSpeakers(files: readonly string[]): InstalledSpeaker[] {
  const byName = new Map<string, { info: VoiceSpeaker; styles: (readonly [number, string])[] }>();
  for (const pack of VOICE_PACKS) {
    if (!files.includes(pack.file)) continue;
    for (const voice of pack.voices) {
      const info = speakerInfo(voice.speaker);
      if (!info) continue;
      const entry = byName.get(voice.speaker) ?? { info, styles: [] };
      entry.styles.push(...voice.styles);
      byName.set(voice.speaker, entry);
    }
  }
  return [...byName.values()];
}

/** A lista para mostrar: o recomendado primeiro, depois na ordem da release. */
export const orderedPacks = (): readonly VoicePack[] => [...VOICE_PACKS].sort((a, b) => Number(b.file === RECOMMENDED_PACK) - Number(a.file === RECOMMENDED_PACK));

/** "57 MB" (em MiB, como o Android mostra). */
export const formatSize = (bytes: number): string => `${Math.round(bytes / 1048576)} MB`;

/** Soma dos arquivos já baixados, para dizer quanto espaço as vozes ocupam. */
export const installedBytes = (files: readonly string[]): number => files.reduce((sum, file) => sum + (packByFile(file)?.bytes ?? 0), 0);

/** Quanto de um arquivo já foi baixado, de 0 a 100 (um download interrompido guarda o que veio). */
export const partialPercent = (bytes: number, pack: VoicePack): number => Math.min(100, Math.max(0, Math.floor((bytes / pack.bytes) * 100)));

/** O aviso antes de baixar: dados móveis gastam o plano, e sem rede não há o que baixar. Null quando está tudo bem. */
export function downloadWarning(network: 'wifi' | 'cellular' | 'none' | 'unknown', remainingBytes: number): string | null {
  if (network === 'cellular') return `Você está usando dados móveis (ou uma rede com franquia): este download gasta até ${formatSize(remainingBytes)} do seu plano.`;
  if (network === 'none') return 'Sem internet no momento: o download não vai começar até a conexão voltar.';
  return null;
}

/** Espaço livre mínimo para baixar um arquivo: ele mais uma folga, porque o aparelho também guarda áudios em cache. */
export const requiredFreeBytes = (pack: VoicePack): number => pack.bytes + 150 * 1048576;
