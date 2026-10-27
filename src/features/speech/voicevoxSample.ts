/** Site oficial do VOICEVOX, de onde vêm as amostras de voz de cada personagem. */
export const VOICEVOX_SITE = 'https://voicevox.hiroshiba.jp';

/**
 * A primeira amostra de fala (não a de canto) que a página de um personagem do site oficial publica. A página guarda os
 * dados em JSON dentro do HTML (`talkVoiceAudios`), com o endereço de um WAV por estilo; o nome do arquivo muda quando o
 * site é refeito, por isso o endereço é lido da página na hora, nunca guardado.
 */
export function parseSampleUrl(html: string): string | null {
  const text = html.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const start = text.indexOf('"talkVoiceAudios"');
  if (start < 0) return null;
  const match = /"urls":\[1,\[\[0,"([^"]+\.wav)"/.exec(text.slice(start));
  return match?.[1] ? new URL(match[1], VOICEVOX_SITE).toString() : null;
}
