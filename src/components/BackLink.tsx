import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

/** Link "← Voltar" no topo das telas empilhadas (lição, revisão, ajustes). */
export function BackLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} hitSlop={12} style={{ alignSelf: 'flex-start', minHeight: 32, justifyContent: 'center' }}>
      <AppText color="primary">{label}</AppText>
    </PressableScale>
  );
}
