import { playFile } from './nativeAudio';
import { synthesizeStyle, useVoicevoxStore } from './voicevox';
import { VOICEVOX_SITE, parseSampleUrl } from './voicevoxSample';

/** Frase de teste das vozes baixadas. */
export const PREVIEW_SENTENCE = 'こんにちは。きょうも いっしょに がんばりましょう。';

/**
 * Toca uma amostra do personagem: com a voz já baixada e o motor pronto, sintetiza a frase de teste no aparelho; senão baixa
 * a amostra do site oficial (precisa de internet; fica em cache). Lança um Error com texto em português se não der.
 */
export async function playSpeakerPreview(slug: string, firstStyleId: number, installed: boolean): Promise<void> {
  if (installed && useVoicevoxStore.getState().status === 'ready') {
    const uri = await synthesizeStyle(PREVIEW_SENTENCE, firstStyleId, 0.9);
    if (uri && playFile(uri)) return;
  }
  // Carregado só aqui: o módulo de arquivos não precisa existir nos testes.
  const { Directory, File, Paths } = await import('expo-file-system');
  const dir = new Directory(Paths.cache, 'voicevox-preview');
  if (!dir.exists) dir.create({ idempotent: true });
  const file = new File(dir, `${slug}.wav`);
  if (!file.exists) {
    let html: string;
    try {
      const response = await fetch(`${VOICEVOX_SITE}/product/${slug}/`);
      if (!response.ok) throw new Error(`site respondeu ${response.status}`);
      html = await response.text();
    } catch {
      throw new Error('Sem internet ou o site do VOICEVOX não respondeu.');
    }
    const url = parseSampleUrl(html);
    if (!url) throw new Error('Não achei a amostra desta voz no site (a página pode ter mudado).');
    await File.downloadFileAsync(url, file, { idempotent: true });
  }
  if (!playFile(file.uri)) throw new Error('Não consegui tocar a amostra.');
}
