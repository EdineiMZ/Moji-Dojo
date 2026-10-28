import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { AppText, Button, Card } from '@/components';

/** Ajustes → Sobre: a versão do app e o caminho para os créditos e as licenças (que ficam numa tela própria). */
export function AboutCard() {
  const router = useRouter();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  return (
    <Card enterIndex={3} tone="lilac">
      <AppText variant="title">Sobre</AppText>
      <AppText>Moji Dojo · versão {version}</AppText>
      <AppText color="muted">
        O app usa conteúdo de fontes abertas, com a licença conferida. Os créditos de cada fonte, o que o ML Kit envia ao Google e as licenças de código aberto estão na tela de créditos.
      </AppText>
      <Button label="Créditos e licenças" variant="soft" onPress={() => router.push('/credits')} />
    </Card>
  );
}
