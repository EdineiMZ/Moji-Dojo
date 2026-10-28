import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, BackLink, Button, Card, ListRow, Screen } from '@/components';
import { AREAS, summaryOf } from '@/features/settings/areas';
import { useSettingsStore } from '@/store';
import { spacing } from '@/theme';

/** Ajustes: uma linha por área, cada uma com o resumo do estado; os detalhes ficam numa tela para cada área. */
export default function SettingsScreen() {
  const router = useRouter();
  const settings = useSettingsStore();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen>
      <View style={styles.header}>
        <BackLink label="← Voltar" onPress={goBack} />
        <AppText variant="headline">Ajustes</AppText>
      </View>

      <Card enterIndex={0}>
        <AppText variant="title">Meu Mochi</AppText>
        <AppText color="muted">Vista o Mochi com os itens que você ganhou.</AppText>
        <Button label="Abrir o armário e a loja" onPress={() => router.push('/mochi')} />
      </Card>

      <View style={styles.list}>
        {AREAS.map((area) => (
          <ListRow key={area.id} icon={area.icon} title={area.title} summary={summaryOf(area.id, settings)} onPress={() => router.push({ pathname: '/settings/[area]', params: { area: area.id } })} />
        ))}
        <ListRow icon="ℹ️" title="Sobre e créditos" summary="Versão, créditos e licenças de código aberto" onPress={() => router.push('/credits')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
  list: { gap: spacing.sm },
});
