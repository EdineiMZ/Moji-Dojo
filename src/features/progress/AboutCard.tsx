import Constants from 'expo-constants';
import { AppText, Card } from '@/components';

/** Versão do app e os créditos exigidos pela licença dos dados de traços. */
export function AboutCard() {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  return (
    <Card enterIndex={3} tone="lilac">
      <AppText variant="title">Sobre</AppText>
      <AppText>Nihongo Dojo · versão {version}</AppText>
      <AppText variant="caption" color="muted">
        Ordem dos traços: KanjiVG, de Ulrich Apel, licença CC BY-SA 3.0 (kanjivg.tagaini.net). Fonte: M PLUS Rounded 1c
        (SIL Open Font License). Mochi e a arte do app são originais.
      </AppText>
    </Card>
  );
}
