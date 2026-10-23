import { StyleSheet, View } from 'react-native';
import { AppText, PressableScale } from '@/components';
import { fonts, radii, spacing, useTheme, type Palette } from '@/theme';
import { ROLES, type Block, type BlockRole } from './anatomy';

/** A cor de fundo de cada papel: "quem/o quê" num tom, "onde/quando" em outro, as ligações em um terceiro e o fim da frase em destaque. */
export const tintOf = (role: BlockRole, colors: Palette): string => {
  switch (role) {
    case 'topic':
    case 'subject':
      return colors.primarySoft;
    case 'object':
      return colors.skySoft;
    case 'target':
    case 'place':
    case 'direction':
    case 'from':
    case 'until':
      return colors.lilacSoft;
    case 'possessor':
    case 'with':
    case 'also':
      return colors.okSoft;
    case 'predicate':
      return colors.primary;
    default:
      return colors.surface;
  }
};

interface BlockRowProps {
  blocks: readonly Block[];
  /** Posição do bloco com destaque (o escolhido ou o da pergunta). */
  selected?: number | null;
  /** Mostra o nome curto do papel embaixo de cada bloco. */
  labels?: boolean;
  onPick?: (index: number) => void;
}

/** A frase em blocos coloridos pelo papel de cada um. Com `onPick`, os blocos são tocáveis. */
export function BlockRow({ blocks, selected = null, labels = true, onPick }: BlockRowProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {blocks.map((b, i) => {
        const onPrimary = labels && b.role === 'predicate';
        const body = (
          <View
            style={[
              styles.block,
              {
                backgroundColor: labels ? tintOf(b.role, colors) : colors.surface,
                borderColor: selected === i ? colors.ink : colors.line,
                borderWidth: selected === i ? 2 : 1.5,
              },
            ]}
          >
            <AppText style={[styles.text, onPrimary && { color: colors.onPrimary }]}>{b.text}</AppText>
            {labels ? (
              <AppText variant="caption" style={{ color: onPrimary ? colors.onPrimary : colors.muted }}>
                {ROLES[b.role].label.split(' ')[0]}
              </AppText>
            ) : null}
          </View>
        );
        return onPick ? (
          <PressableScale key={`${i}-${b.text}`} accessibilityRole="button" accessibilityLabel={`${b.text}: ${ROLES[b.role].label}`} onPress={() => onPick(i)}>
            {body}
          </PressableScale>
        ) : (
          <View key={`${i}-${b.text}`}>{body}</View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  block: { borderRadius: radii.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, alignItems: 'center', gap: 2 },
  text: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 28 },
});
