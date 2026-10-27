import { VOICE_PACKS, VOICE_PACKS_RELEASE, type VoicePack } from './voicevoxCatalog';

/** O arquivo que traz ずんだもん, 四国めたん, 春日部つむぎ e 雨晴はう: o que o app sugere baixar primeiro. */
export const RECOMMENDED_PACK = '0.vvm';

/** Termos de uso das vozes (os gerais e os de cada personagem), no repositório oficial. */
export const VOICEVOX_TERMS_URL = 'https://github.com/VOICEVOX/voicevox_vvm/blob/main/TERMS.txt';

/** Onde cada arquivo é baixado: a release oficial, direto para o aparelho (o app não tem servidor). */
export const packUrl = (file: string): string => `https://github.com/VOICEVOX/voicevox_vvm/releases/download/${VOICE_PACKS_RELEASE}/${file}`;

export const packByFile = (file: string): VoicePack | undefined => VOICE_PACKS.find((p) => p.file === file);

/** O arquivo que contém um estilo (personagem + tom), para saber o que baixar para usar aquela voz. */
export const packForStyle = (styleId: number): VoicePack | undefined => VOICE_PACKS.find((p) => p.styles.includes(styleId));

/** A lista para mostrar: o recomendado primeiro, depois na ordem da release. */
export const orderedPacks = (): readonly VoicePack[] => [...VOICE_PACKS].sort((a, b) => Number(b.file === RECOMMENDED_PACK) - Number(a.file === RECOMMENDED_PACK));

/** "57 MB" (em MiB, como o Android mostra). */
export const formatSize = (bytes: number): string => `${Math.round(bytes / 1048576)} MB`;

/** Soma dos arquivos já baixados, para dizer quanto espaço as vozes ocupam. */
export const installedBytes = (files: readonly string[]): number => files.reduce((sum, file) => sum + (packByFile(file)?.bytes ?? 0), 0);

/** Espaço livre mínimo para baixar um arquivo: ele mais uma folga, porque o aparelho também guarda áudios em cache. */
export const requiredFreeBytes = (pack: VoicePack): number => pack.bytes + 150 * 1048576;
