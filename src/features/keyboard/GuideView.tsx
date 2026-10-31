import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card } from '@/components';
import { fonts, radii, spacing, useTheme } from '@/theme';

interface GuideViewProps {
  onPractice: () => void;
}

/** Uma célula da cruz de exemplo (tecla か e as direções). */
function CrossCell({ char, hint, center }: { char?: string; hint?: string; center?: boolean }) {
  const { colors } = useTheme();
  if (!char) return <View style={styles.cell} />;
  return (
    <View
      style={[
        styles.cell,
        styles.cellFilled,
        { borderColor: center ? colors.primary : colors.line, backgroundColor: center ? colors.primarySoft : colors.surface },
      ]}
    >
      {/* A tecla tem tamanho fixo (desenha uma cruz): o texto dela para de crescer com a fonte do sistema um pouco antes. */}
      <AppText maxFontSizeMultiplier={1.2} style={{ fontFamily: fonts.bold, fontSize: 26, lineHeight: 32 }}>
        {char}
      </AppText>
      <AppText variant="caption" color="muted" maxFontSizeMultiplier={1.2} numberOfLines={1}>
        {hint}
      </AppText>
    </View>
  );
}

/** Como funciona o teclado japonês de 12 teclas com deslize (flick), no Android. */
export function GuideView({ onPractice }: GuideViewProps) {
  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <AppText variant="caption" color="muted">
          TECLADO DE 12 TECLAS COM DESLIZE (FLICK)
        </AppText>
        <AppText>
          Cada tecla é uma <Bold>linha da tabela</Bold>. A tecla か guarda か, き, く, け e こ. Você escolhe qual sai pela
          direção do dedo:
        </AppText>
        <View accessibilityLabel="Tecla か e as direções" style={styles.cross}>
          <CrossCell />
          <CrossCell char="く" hint="↑ u" />
          <CrossCell />
          <CrossCell char="き" hint="← i" />
          <CrossCell char="か" hint="toque · a" center />
          <CrossCell char="け" hint="→ e" />
          <CrossCell />
          <CrossCell char="こ" hint="↓ o" />
          <CrossCell />
        </View>
        <AppText>
          A regra vale para todas as teclas: <Bold>centro a, esquerda i, cima u, direita e, baixo o</Bold>. Decorou isso,
          decorou o teclado inteiro.
        </AppText>
      </Card>

      <Card enterIndex={1}>
        <AppText variant="caption" color="muted">
          PASSO A PASSO
        </AppText>
        <AppText>
          1. <Bold>Toque e solte</Bold> para a primeira letra da linha (か).
        </AppText>
        <AppText>
          2. <Bold>Toque, segure e deslize</Bold> para as outras. Ao segurar, o teclado mostra as opções em cruz.
        </AppText>
        <AppText>
          3. Tocar várias vezes seguidas na mesma tecla também troca a letra (か, き, く…). Funciona, mas deslizar é bem mais
          rápido.
        </AppText>
        <AppText>
          4. <Bold>Tracinhos e letras pequenas:</Bold> digite a letra normal e depois toque na tecla <Bold>小゛゜</Bold>. か
          vira が. は vira ば e depois ぱ. つ vira っ e depois づ. や vira ゃ. Essa tecla costuma ficar na fileira de baixo, ao
          lado do わ. Em algumas versões ela só aparece enquanto você está digitando, no lugar do globo.
        </AppText>
        <AppText>
          5. <Bold>O traço longo ー</Bold> fica na tecla わ: deslize para a direita. Na mesma tecla, esquerda dá を e cima dá
          ん.
        </AppText>
        <AppText>
          6. <Bold>Kanji e katakana:</Bold> digite em hiragana e escolha na barra de sugestões, acima do teclado. にほん vira
          日本; らーめん vira ラーメン. A tecla de espaço também mostra mais opções.
        </AppText>
        <AppText>
          7. A tecla <Bold>あa1</Bold> alterna entre japonês, letras e números. A tecla com <Bold>記</Bold> abre emojis e
          símbolos.
        </AppText>
        <AppText variant="caption" color="muted">
          Prefere digitar com letras? Nas configurações do Gboard, em Idiomas → Japonês, dá para escolher o layout QWERTY: você
          digita “ka” e sai か. Os nomes e posições podem mudar um pouco entre versões do teclado.
        </AppText>
        <Button label="Treinar no simulador" onPress={onPractice} />
      </Card>
    </View>
  );
}

const CELL = 84;

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  cross: { width: CELL * 3, flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center' },
  cell: { width: CELL, height: CELL, alignItems: 'center', justifyContent: 'center' },
  cellFilled: { borderWidth: 1.5, borderRadius: radii.md, transform: [{ scale: 0.94 }] },
});
