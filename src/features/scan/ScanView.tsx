import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppText, Bold, Button, Card, LearnMore, useScrollIntoView } from '@/components';
import { AiDisclaimer } from '@/features/ai/AiParts';
import { AiError } from '@/features/ai/client';
import { TappableSentence } from '@/features/ai/TappableSentence';
import { explainText, MAX_TEXT_LENGTH, type TextExplanation } from '@/features/ai/tasks';
import { useAiReady } from '@/features/ai/useAi';
import { PROBLEM_MESSAGES } from '@/features/myphrases/phrases';
import { speakJapanese } from '@/features/speech/voiceStore';
import { useProgressStore, useSettingsStore } from '@/store';
import { SPEECH_RATES } from '@/store/settingsStore';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { hasJapanese, recognizeText, scanAvailable } from './textScan';

const PICK_OPTIONS: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, quality: 0.9 };

/** Câmera para ler: fotografe um texto em japonês (cardápio, placa, aviso), o app lê no aparelho e cada palavra vira tocável. */
export function ScanView() {
  const { colors } = useTheme();
  const scrollIntoView = useScrollIntoView();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const aiReady = useAiReady();
  const addMyPhrase = useProgressStore((s) => s.addMyPhrase);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [explaining, setExplaining] = useState(false);
  const [explained, setExplained] = useState<{ source: string; result: TextExplanation } | null>(null);
  const [saved, setSaved] = useState<{ text: string; ok: boolean } | null>(null);

  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l !== '');

  const read = async (pick: 'camera' | 'library') => {
    setError('');
    setSaved(null);
    setExplained(null);
    try {
      if (pick === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setError('Sem permissão para a câmera. Você pode escolher uma foto da galeria no lugar.');
          return;
        }
      }
      const picked = pick === 'camera' ? await ImagePicker.launchCameraAsync(PICK_OPTIONS) : await ImagePicker.launchImageLibraryAsync(PICK_OPTIONS);
      const uri = picked.canceled ? undefined : picked.assets[0]?.uri;
      if (!uri) return;
      setBusy(true);
      const result = await recognizeText(uri);
      if (result.lines.length === 0 || !hasJapanese(result.lines.join(''))) {
        setText('');
        setError('Não achei texto em japonês na foto. Tente chegar mais perto, com boa luz, ou recorte só o texto.');
      } else {
        setText(result.lines.join('\n'));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não consegui ler a foto.');
    } finally {
      setBusy(false);
    }
  };

  const explain = async () => {
    const source = lines.join('\n').slice(0, MAX_TEXT_LENGTH);
    setExplaining(true);
    setSaved(null);
    try {
      setExplained({ source, result: await explainText(source) });
    } catch (e) {
      setError(e instanceof AiError ? e.message : 'Não consegui falar com a IA agora.');
    } finally {
      setExplaining(false);
    }
  };

  const save = (jp: string, pt: string) => {
    const added = addMyPhrase(jp, pt);
    setSaved('error' in added ? { text: PROBLEM_MESSAGES[added.error], ok: false } : { text: 'Salva em Minhas frases. Ela entra na sua revisão.', ok: true });
  };

  if (!scanAvailable) {
    return (
      <Card enterIndex={0}>
        <AppText variant="title">Câmera para ler</AppText>
        <AppText color="muted">Este app foi gerado sem o leitor de texto. Gere o APK de novo com o gerar-apk.bat para usar a câmera.</AppText>
      </Card>
    );
  }

  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <AppText variant="title">Câmera para ler</AppText>
        <AppText color="muted">
          Fotografe um texto em japonês (cardápio, placa, aviso). A leitura acontece no seu aparelho, sem internet. Depois do recorte, toque nas palavras para ver a leitura e o significado.
        </AppText>
        <View style={styles.row}>
          <Button label={busy ? 'Lendo...' : '📷 Fotografar'} style={styles.flex} onPress={() => void read('camera')} disabled={busy} />
          <Button label="🖼 Da galeria" variant="soft" style={styles.flex} onPress={() => void read('library')} disabled={busy} />
        </View>
        <AppText variant="caption" color="muted">
          Dica: use o recorte para deixar só o texto, com boa luz. Textos na vertical e letras muito decoradas podem sair errados.
        </AppText>
        <LearnMore label="Sobre a privacidade do leitor">
          <AppText variant="caption" color="muted">
            A foto é lida no aparelho e o app não a envia a ninguém. O leitor é o Google ML Kit, que, segundo o Google, envia dados técnicos de uso (modelo do aparelho, versão do Android, nome e versão do app, um identificador da instalação e medidas de desempenho). O conteúdo da foto e o texto lido não estão na lista do que o Google diz coletar. Não há como desligar isso no ML Kit. Os detalhes estão em Ajustes → Créditos e licenças.
          </AppText>
        </LearnMore>
        {error ? (
          <AppText color="bad" accessibilityLiveRegion="polite">
            {error}
          </AppText>
        ) : null}
      </Card>

      {lines.length > 0 ? (
        <Card>
          <AppText variant="title">Texto lido</AppText>
          <AppText variant="caption" color="muted">
            O leitor erra às vezes. Corrija aqui se algum caractere veio trocado:
          </AppText>
          <TextInput
            value={text}
            onChangeText={(t) => {
              setText(t);
              setExplained(null);
            }}
            multiline
            onFocus={(e) => scrollIntoView(e.target)}
            accessibilityLabel="Texto reconhecido na foto"
            style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.line }]}
          />
          <AppText variant="caption" color="muted">
            TOQUE NAS PALAVRAS
          </AppText>
          {lines.map((line, i) => (
            <View key={`${i}-${line}`} style={[styles.line, { backgroundColor: colors.lilacSoft }]}>
              <TappableSentence jp={line} reading={line} />
              <AppText variant="caption" color="primary" accessibilityRole="button" onPress={() => speakJapanese(line.replace(/\s/g, ''), SPEECH_RATES[speed])}>
                🔊 Ouvir
              </AppText>
            </View>
          ))}
          {aiReady ? (
            <Button label={explaining ? 'Explicando...' : '✨ Traduzir e explicar com IA'} variant="soft" onPress={() => void explain()} disabled={explaining} />
          ) : (
            <AppText variant="caption" color="muted">
              Com a IA ligada em Ajustes, dá para traduzir e explicar o texto inteiro.
            </AppText>
          )}
          {explained ? (
            <View style={[styles.line, { backgroundColor: colors.skySoft }]} accessibilityLiveRegion="polite">
              <AppText>
                <Bold>Tradução:</Bold> {explained.result.translation}
              </AppText>
              {explained.result.words.slice(0, 8).map((w) => (
                <AppText key={`${w.word}-${w.meaning}`}>
                  <Bold>{w.word}</Bold>
                  {w.reading && w.reading !== w.word ? ` (${w.reading})` : ''} {w.meaning}
                </AppText>
              ))}
              <Button label="Salvar a frase" variant="soft" onPress={() => save(explained.source.replace(/\n/g, ' '), explained.result.translation)} />
              <AiDisclaimer />
            </View>
          ) : null}
          {saved ? (
            <AppText color={saved.ok ? 'ok' : 'bad'} accessibilityLiveRegion="polite">
              {saved.text}
            </AppText>
          ) : null}
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.sm },
  line: { borderRadius: radii.md, padding: spacing.md, gap: spacing.xs },
  input: { borderWidth: 1.5, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: fonts.regular, fontSize: fontSizes.body, minHeight: 90, textAlignVertical: 'top' },
});
