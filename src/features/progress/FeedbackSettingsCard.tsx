import { StyleSheet, Switch, View } from 'react-native';
import { AppText, Card } from '@/components';
import { useSettingsStore } from '@/store';
import { spacing, useTheme } from '@/theme';

interface SwitchRowProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

function SwitchRow({ label, description, value, onChange }: SwitchRowProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.flex}>
        <AppText>{label}</AppText>
        <AppText variant="caption" color="muted">
          {description}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ false: colors.line, true: colors.primary }}
        thumbColor={colors.surface}
      />
    </View>
  );
}

/** Ajustes: liga e desliga os efeitos sonoros e a vibração. A voz japonesa não é afetada. */
export function FeedbackSettingsCard() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const setHapticsEnabled = useSettingsStore((s) => s.setHapticsEnabled);
  const nativeAudio = useSettingsStore((s) => s.nativeAudio);
  const setNativeAudio = useSettingsStore((s) => s.setNativeAudio);

  return (
    <Card enterIndex={1}>
      <AppText variant="title">Sons e vibração</AppText>
      <SwitchRow
        label="Efeitos sonoros"
        description="Sons curtos ao acertar, errar e concluir lições. A voz japonesa continua independente."
        value={soundEnabled}
        onChange={setSoundEnabled}
      />
      <SwitchRow
        label="Vibração"
        description="Um toque leve ao acertar, errar, trocar de aba e digitar nas teclas do simulador."
        value={hapticsEnabled}
        onChange={setHapticsEnabled}
      />
      <SwitchRow
        label="Gravações de falantes nativos"
        description="Nas palavras que têm gravação, toca a voz de uma pessoa em vez da voz do aparelho. Desligado: sempre a voz do aparelho."
        value={nativeAudio}
        onChange={setNativeAudio}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
