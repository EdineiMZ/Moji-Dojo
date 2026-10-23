import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

/**
 * Tela de erro do app inteiro: aparece no lugar de uma tela em branco se algo quebrar ao desenhar. Não usa o tema nem as
 * fontes do app, porque o erro pode ter vindo deles. O progresso fica salvo no aparelho a cada resposta.
 */
export function ErrorScreen({ retry }: { retry: () => void | Promise<void> }) {
  const dark = useColorScheme() === 'dark';
  const ink = dark ? '#f1ecff' : '#2b2342';
  return (
    <View style={[styles.root, { backgroundColor: dark ? '#1a1638' : '#fff8fb' }]}>
      <Text style={[styles.title, { color: ink }]}>Algo deu errado</Text>
      <Text style={[styles.body, { color: ink }]}>
        O Mochi tropeçou, mas o seu progresso está salvo no aparelho. Toque para tentar de novo; se repetir, feche e abra o app.
      </Text>
      <Pressable accessibilityRole="button" onPress={() => void retry()} style={styles.button}>
        <Text style={styles.buttonText}>Tentar de novo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
  button: { backgroundColor: '#ff9ec4', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28, minHeight: 48 },
  buttonText: { color: '#2b2342', fontSize: 16, fontWeight: '700' },
});
