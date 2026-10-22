import { StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { Card } from './Card';
import { Mascot } from './mascot/Mascot';

/** Marcador temporário das partes ainda não construídas (sai quando todas estiverem prontas). */
export function SoonCard({ text }: { text: string }) {
  return (
    <Card enterIndex={0} style={styles.center}>
      <Mascot mood="happy" size={110} />
      <AppText center color="muted">
        {text}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({ center: { alignItems: 'center' } });
