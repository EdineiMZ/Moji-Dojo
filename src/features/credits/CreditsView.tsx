import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Card, Collapsible } from '@/components';
import { WORD_RECORDINGS } from '@/content/wordAudio';
import { spacing } from '@/theme';
import { OpenSourceList } from './OpenSourceList';

const RECORDINGS = Object.values(WORD_RECORDINGS);
const SPEAKERS = [...new Set(RECORDINGS.map((r) => r.speaker))].sort((a, b) => a.localeCompare(b));

/** Um parágrafo de crédito, em letra pequena. */
function Credit({ children }: { children: React.ReactNode }) {
  return (
    <AppText variant="caption" color="muted">
      {children}
    </AppText>
  );
}

/**
 * Créditos e licenças. Reúne o que as licenças das fontes exigem que o app mostre: quem fez cada dado, a licença, o que foi
 * alterado e o aviso que cada componente de terceiros pede.
 */
export function CreditsView() {
  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <AppText variant="title">Sobre</AppText>
        <AppText color="muted">
          O Moji Dojo usa conteúdo de fontes abertas, com a licença conferida e o crédito aqui. O que foi escrito por IA para o app (explicações, diálogos, textos de leitura, frases de viagem e descrições das vozes) ainda não foi revisado por um falante de japonês.
        </AppText>
      </Card>

      <Collapsible title="Escrita e dados" hint="KanjiVG, JMdict, Kanjium e as listas JLPT" defaultOpen>
        <Credit>
          <Bold>Ordem dos traços:</Bold> KanjiVG, de Ulrich Apel e colaboradores (kanjivg.tagaini.net), licença CC BY-SA 3.0. O formato dos dados foi alterado (de SVG para JSON); os valores foram conferidos com o KanjiVG (versão 20260714) e são idênticos.
        </Credit>
        <Credit>
          <Bold>Dicionário e kanji:</Bold> este app usa os arquivos de dicionário JMdict e KANJIDIC2. Esses arquivos são propriedade do Electronic Dictionary Research and Development Group e são usados em conformidade com a licença do grupo (edrdg.org/edrdg/licence.html), CC BY-SA 4.0. Deles vêm a classe das palavras, as leituras e os kanji do N4.
        </Credit>
        <Credit>
          <Bold>Tom das palavras:</Bold> Kanjium (CC BY-SA 4.0). &ldquo;The pitch accent notation, verb particle data, phonetics, homonyms and other additions or modifications to EDICT, KANJIDIC or KRADFILE were provided by Uros O. through his free database.&rdquo;
        </Credit>
        <Credit>
          <Bold>Vocabulário:</Bold> listas JLPT de Jonathan Waller (tanos.co.uk, Creative Commons BY), pelo projeto open-anki-jlpt-decks (MIT). Os significados em português foram traduzidos para este app e não foram revisados por um falante.
        </Credit>
      </Collapsible>

      <Collapsible title="Frases e áudio" hint="Tatoeba e Lingua Libre">
        <Credit>
          <Bold>Frases:</Bold> exemplos da gramática, banco de frases e Explorar frases vêm do Tatoeba (tatoeba.org), licença CC BY 2.0 FR. Cada frase mostra o número dela no Tatoeba, que leva ao autor. A escrita em kana e o romaji foram feitos para este app.
        </Credit>
        <Credit>
          <Bold>Áudio das palavras:</Bold> {RECORDINGS.length} gravações de falantes nativos do Lingua Libre (Wikimedia Commons), licenças CC0, CC BY 4.0 e CC BY-SA 4.0, convertidas para mp3. Falantes: {SPEAKERS.join(', ')}.
        </Credit>
      </Collapsible>

      <Collapsible title="Vozes de anime (VOICEVOX)" hint="Crédito obrigatório e termos de cada personagem">
        <Credit>
          VOICEVOX (voicevox.hiroshiba.jp), com o dicionário do Open JTalk. As vozes são baixadas por quem quiser, da release oficial (github.com/VOICEVOX/voicevox_vvm), depois de aceitar os termos de cada personagem.
        </Credit>
        <Credit>
          <Bold>Crédito obrigatório:</Bold> toda voz usada exige &ldquo;VOICEVOX:nome do personagem&rdquo; (por exemplo VOICEVOX:ずんだもん). Se você compartilhar um áudio gerado com o app, cite o crédito e siga os termos do personagem; o botão &ldquo;Termos&rdquo; de cada voz abre a página dele.
        </Credit>
      </Collapsible>

      <Collapsible title="Câmera, fala e privacidade" hint="O que sai do aparelho">
        <Credit>
          <Bold>Câmera para ler:</Bold> reconhecimento de texto do Google ML Kit, com o modelo japonês dentro do app. O reconhecimento roda no aparelho e funciona sem internet.
        </Credit>
        <Credit>
          <Bold>Dados técnicos do ML Kit:</Bold> segundo o Google, o ML Kit coleta dados técnicos de uso (modelo do aparelho, versão do Android, nome e versão do app, um identificador por instalação e métricas de desempenho) e os envia ao Google por HTTPS (developers.google.com/ml-kit/android-data-disclosure). O conteúdo das imagens não está entre os dados que o Google lista.
        </Credit>
        <Credit>
          <Bold>Reconhecimento de fala (Ouvir → Falar):</Bold> usa o serviço de fala do Android (Google); o app não guarda o áudio.
        </Credit>
        <Credit>
          <Bold>IA opcional:</Bold> se você cadastrar uma chave, o texto do pedido é enviado ao provedor que escolheu (Gemini, Claude ou GPT), com a sua chave. A chave fica no armazenamento seguro do aparelho e fora do backup.
        </Credit>
      </Collapsible>

      <Collapsible title="Fonte, arte e licença do app" hint="M PLUS Rounded 1c e a licença MIT">
        <Credit>
          <Bold>Fonte:</Bold> M PLUS Rounded 1c (SIL Open Font License 1.1). <Bold>Arte e sons:</Bold> o Mochi, os itens da loja e a arte do app são originais; os efeitos sonoros são sintetizados por código.
        </Credit>
        <Credit>
          <Bold>Licença do app:</Bold> o código, a arte e os sons originais do Moji Dojo são distribuídos sob a licença MIT (texto completo no arquivo LICENSE do projeto), com esclarecimentos sobre o conteúdo de terceiros e sobre o material de estudo escrito por IA.
        </Credit>
      </Collapsible>

      <Collapsible title="Licenças de código aberto" hint="Pacotes, bibliotecas Android e componentes nativos">
        <OpenSourceList />
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
});
