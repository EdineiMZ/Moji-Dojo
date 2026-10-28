import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow, LearnMore } from '@/components';
import { useSettingsStore } from '@/store';
import { spacing } from '@/theme';
import { openVoiceSettings } from './openVoiceSettings';
import { ensureVoiceChecked, speakJapanese, useVoiceStore } from './voiceStore';
import { VOICE_INSTALL_STEPS, voiceLabel } from './voices';

const TEST_PHRASE = 'こんにちは。にほんごの れんしゅうを しましょう。';

/** Ajustes: situação da voz japonesa do aparelho, teste de som e ajuda para instalar. */
export function VoiceStatusCard() {
  const status = useVoiceStore((s) => s.status);
  const check = useVoiceStore((s) => s.check);
  const voices = useVoiceStore((s) => s.voices);
  const choose = useVoiceStore((s) => s.choose);
  const voiceId = useSettingsStore((s) => s.voiceId);

  useEffect(ensureVoiceChecked, []);

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Voz japonesa</AppText>

      {status === 'checking' ? <AppText color="muted">Verificando a voz do aparelho…</AppText> : null}

      {status === 'available' ? (
        <AppText>
          <Bold>A voz japonesa do celular está pronta.</Bold> Toque em “Testar voz” para ouvir.
        </AppText>
      ) : null}

      {status === 'missing' ? (
        <>
          <AppText>
            <Bold>Não encontrei uma voz japonesa neste celular.</Bold> O som pode sair mudo ou com sotaque errado. Para
            instalar:
          </AppText>
          <View style={styles.steps}>
            {VOICE_INSTALL_STEPS.map((step, i) => (
              <AppText key={step} variant="caption">
                <Bold>{i + 1}. </Bold>
                {step}
              </AppText>
            ))}
          </View>
          <LearnMore label="Não achei o menu">
            <AppText variant="caption" color="muted">
              Os nomes dos menus mudam um pouco entre aparelhos. Depois de instalar, toque em “Verificar de novo”.
            </AppText>
          </LearnMore>
        </>
      ) : null}

      {voices.length > 1 ? (
        <>
          <AppText variant="caption" color="muted">
            ESCOLHER A VOZ
          </AppText>
          <ChipRow wrap
            options={[
              { value: 'auto', label: 'Automática' },
              ...voices.map((v, i) => ({ value: v.identifier, label: voiceLabel(v, i) })),
            ]}
            value={voiceId && voices.some((v) => v.identifier === voiceId) ? voiceId : 'auto'}
            onChange={(v) => {
              choose(v === 'auto' ? null : v);
              setTimeout(() => speakJapanese(TEST_PHRASE), 100);
            }}
          />
          <LearnMore>
            <AppText variant="caption" color="muted">
              A automática usa a de melhor qualidade que o aparelho tiver. Vozes online costumam soar mais naturais, mas precisam de internet.
            </AppText>
          </LearnMore>
        </>
      ) : null}

      <View style={styles.actions}>
        <Button label="🔊 Testar voz" onPress={() => speakJapanese(TEST_PHRASE)} />
        <Button label="🔊 Testar devagar" variant="soft" onPress={() => speakJapanese(TEST_PHRASE, 0.6)} />
        {status === 'missing' ? <Button label="Abrir ajustes de voz" variant="soft" onPress={() => void openVoiceSettings()} /> : null}
        <Button label="Verificar de novo" variant="ghost" onPress={() => void check()} />
      </View>

    </Card>
  );
}

const styles = StyleSheet.create({
  steps: { gap: spacing.xs },
  actions: { gap: spacing.sm },
});
