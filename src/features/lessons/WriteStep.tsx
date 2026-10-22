import { StyleSheet } from 'react-native';
import { AppText, Button, Card, Mascot } from '@/components';

interface WriteStepProps {
  onContinue: () => void;
}

/**
 * Passo 2 da lição. O desenho livre com o dedo fica para a Fase 2:
 * por enquanto é só um espaço reservado que leva ao teste.
 */
export function WriteStep({ onContinue }: WriteStepProps) {
  return (
    <Card enterIndex={0} tone="sky" style={styles.card}>
      <Mascot mood="happy" size={120} />
      <AppText variant="title" center>
        Escrever: em breve
      </AppText>
      <AppText center color="muted">
        Aqui você vai escrever cada caractere com o dedo, por cima do modelo. Esse passo chega na próxima fase do app.
        Por enquanto, siga para o teste.
      </AppText>
      <Button label="Ir para o teste" onPress={onContinue} />
    </Card>
  );
}

const styles = StyleSheet.create({ card: { alignItems: 'center' } });
