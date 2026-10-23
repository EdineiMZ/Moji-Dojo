import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, PressableScale } from '@/components';
import { FLICK_KEYS } from '@/data/keyboard';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { applyMod } from './flick';
import { FlickKeyButton } from './FlickKeyButton';

/** O teclado de flick real tem 3 colunas x 4 linhas: あ か さ / た な は / ま や ら / 小゛゜ わ 、。?! */
const COLUMNS = 3;

interface FlickPadProps {
  value: string;
  onChange: (value: string) => void;
  /** Tecla a destacar (a dica do simulador); nenhuma por padrão. */
  hintedKey?: string | null;
  /** Chamado a cada letra digitada, depois de o valor mudar. */
  onType?: (next: string) => void;
}

/**
 * O teclado de flick do app: as 12 teclas mais ⌫ e Limpar. Quem usa guarda o texto e recebe o novo valor em
 * `onChange`. A largura da grade é medida na tela (sempre 3 colunas).
 */
export function FlickPad({ value, onChange, hintedKey = null, onType }: FlickPadProps) {
  const { colors } = useTheme();
  // Largura real da área do teclado: medida na tela, em vez de estimada pelas margens (que já errou a conta).
  const [boardWidth, setBoardWidth] = useState(0);
  const keySize = Math.floor(boardWidth / COLUMNS);

  const update = (next: string) => {
    onChange(next);
    onType?.(next);
  };

  return (
    <View onLayout={(e) => setBoardWidth(e.nativeEvent.layout.width)}>
      {keySize > 0 ? (
        <>
          {/* Largura de exatamente 3 teclas: a grade nunca quebra em outro número de colunas. */}
          <View style={[styles.keys, { width: keySize * COLUMNS }]}>
            {FLICK_KEYS.map((keyData) => (
              <FlickKeyButton
                key={keyData.label}
                keyData={keyData}
                size={keySize}
                hinted={hintedKey === keyData.label}
                onInput={(char) => update(value + char)}
                onMod={() => update(applyMod(value))}
              />
            ))}
          </View>
          <View style={[styles.actions, { width: keySize * COLUMNS }]}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Apagar"
              onPress={() => onChange([...value].slice(0, -1).join(''))}
              style={[styles.actionKey, { backgroundColor: colors.lilacSoft, borderColor: colors.line }]}
            >
              <AppText style={{ fontFamily: fonts.bold, fontSize: 22 }}>⌫</AppText>
            </PressableScale>
            <PressableScale
              accessibilityRole="button"
              onPress={() => onChange('')}
              style={[styles.actionKey, { backgroundColor: colors.lilacSoft, borderColor: colors.line }]}
            >
              <AppText style={{ fontFamily: fonts.bold }}>Limpar</AppText>
            </PressableScale>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  keys: { alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap' },
  actions: { alignSelf: 'center', flexDirection: 'row', gap: spacing.sm, paddingHorizontal: 3, marginTop: spacing.sm },
  actionKey: { flex: 1, minHeight: 48, borderRadius: radii.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
