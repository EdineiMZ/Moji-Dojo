import { StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { Card } from './Card';
import { Mascot } from './mascot/Mascot';
import { Screen } from './Screen';

/** Tela provisória das partes que ainda não foram construídas. */
export function ComingSoon({ title, text }: { title: string; text: string }) {
  return (
    <Screen>
      <AppText variant="headline">{title}</AppText>
      <Card enterIndex={0} style={styles.center}>
        <Mascot mood="happy" size={120} />
        <AppText center color="muted">
          {text}
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({ center: { alignItems: 'center' } });
