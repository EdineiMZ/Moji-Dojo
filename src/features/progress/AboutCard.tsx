import Constants from 'expo-constants';
import { AppText, Card } from '@/components';
import { WORD_RECORDINGS } from '@/content/wordAudio';

const RECORDINGS = Object.values(WORD_RECORDINGS);
const SPEAKERS = [...new Set(RECORDINGS.map((r) => r.speaker))].sort((a, b) => a.localeCompare(b));

/** Versão do app e os créditos exigidos pela licença dos dados de traços. */
export function AboutCard() {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  return (
    <Card enterIndex={3} tone="lilac">
      <AppText variant="title">Sobre</AppText>
      <AppText>Moji Dojo · versão {version}</AppText>
      <AppText variant="caption" color="muted">
        Ordem dos traços: KanjiVG, de Ulrich Apel, licença CC BY-SA 3.0 (kanjivg.tagaini.net). Fonte: M PLUS Rounded 1c
        (SIL Open Font License). Mochi e a arte do app são originais.
      </AppText>
      <AppText variant="caption" color="muted">
        Vocabulário: lista JLPT N5 do projeto open-anki-jlpt-decks (MIT), baseada nas listas de Jonathan Waller
        (tanos.co.uk, licença Creative Commons BY). Os significados em português foram traduzidos para este app e
        não foram revisados por um falante.
      </AppText>
      <AppText variant="caption" color="muted">
        Frases de exemplo da gramática (tópicos 11 a 51) e do Banco de frases: Tatoeba (tatoeba.org), licença CC BY 2.0
        FR, com a escrita em kana e o romaji feitos para este app. Os textos explicativos e as falas dos diálogos são
        originais e não foram revisados por um falante.
      </AppText>
      <AppText variant="caption" color="muted">
        Áudio das palavras: {RECORDINGS.length} gravações de falantes nativos do Lingua Libre (Wikimedia Commons), licenças CC0,
        CC BY 4.0 e CC BY-SA 4.0. Falantes: {SPEAKERS.join(', ')}. A página de cada gravação está em src/content/wordAudio.ts.
      </AppText>
      <AppText variant="caption" color="muted">
        Voz de anime (opcional): VOICEVOX (voicevox.hiroshiba.jp), com o dicionário do Open JTalk. As vozes são baixadas por quem
        quiser, em Ajustes, da release oficial (github.com/VOICEVOX/voicevox_vvm). Cada voz usada tem o crédito
        &ldquo;VOICEVOX:nome do personagem&rdquo;, por exemplo VOICEVOX:ずんだもん ou VOICEVOX:四国めたん. Os termos de uso das
        vozes e de cada personagem estão no repositório oficial e são mostrados a cada download, antes de ele começar.
      </AppText>
      <AppText variant="caption" color="muted">
        Câmera para ler: reconhecimento de texto do Google ML Kit, com o modelo japonês dentro do app (funciona sem internet).
      </AppText>
    </Card>
  );
}
