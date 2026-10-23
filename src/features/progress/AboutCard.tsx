import Constants from 'expo-constants';
import { AppText, Card } from '@/components';

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
        (tanos.co.uk). Os significados em português foram traduzidos para este app e não foram revisados por um
        falante. Uso pessoal: as licenças ainda precisam ser validadas antes de qualquer publicação.
      </AppText>
    </Card>
  );
}
