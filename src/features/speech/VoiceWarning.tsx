import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card } from '@/components';
import { spacing } from '@/theme';
import { openVoiceSettings } from './openVoiceSettings';
import { ensureVoiceChecked, useVoiceStore } from './voiceStore';
import { VOICE_INSTALL_STEPS } from './voices';

/**
 * Aviso amigável quando o aparelho não tem voz japonesa, com o passo a passo para instalar.
 * Não mostra nada enquanto verifica, quando a voz existe ou depois de dispensado.
 */
export function VoiceWarning() {
  const status = useVoiceStore((s) => s.status);
  const dismissed = useVoiceStore((s) => s.dismissed);
  const check = useVoiceStore((s) => s.check);
  const dismiss = useVoiceStore((s) => s.dismiss);

  useEffect(ensureVoiceChecked, []);

  if (status !== 'missing' || dismissed) return null;

  return (
    <Card tone="lilac">
      <AppText variant="title">Falta a voz japonesa</AppText>
      <AppText>
        Não encontrei uma voz em japonês neste celular, então o som pode sair mudo ou com sotaque errado. É rápido de
        resolver:
      </AppText>
      <View style={styles.steps}>
        {VOICE_INSTALL_STEPS.map((step, i) => (
          <AppText key={step} variant="caption">
            <Bold>{i + 1}. </Bold>
            {step}
          </AppText>
        ))}
      </View>
      <AppText variant="caption" color="muted">
        Os nomes dos menus mudam um pouco entre aparelhos. Depois de instalar, toque em "Verificar de novo".
      </AppText>
      <View style={styles.actions}>
        <Button label="Abrir ajustes de voz" onPress={() => void openVoiceSettings()} />
        <Button label="Verificar de novo" variant="soft" onPress={() => void check()} />
        <Button label="Agora não" variant="ghost" onPress={dismiss} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  steps: { gap: spacing.xs },
  actions: { gap: spacing.sm },
});
