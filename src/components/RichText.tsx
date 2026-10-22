import { StyleSheet, Text, View } from 'react-native';
import type { RichBlock, RichParagraph, RichTable } from '@/data/types';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { AppText } from './AppText';

function Paragraph({ block }: { block: RichParagraph }) {
  return (
    <AppText>
      {block.runs.map((run, i) => (
        <Text key={i} style={run.bold ? styles.bold : undefined}>
          {run.text}
        </Text>
      ))}
    </AppText>
  );
}

function Table({ block }: { block: RichTable }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.table, { borderColor: colors.line }]}>
      {block.rows.map((row, r) => (
        <View key={r} style={[styles.row, r > 0 && { borderTopColor: colors.line, borderTopWidth: 1 }]}>
          {row.map((cell, c) => (
            <View
              key={c}
              style={[
                styles.cell,
                cell.header && { backgroundColor: colors.lilacSoft },
                c > 0 && { borderLeftColor: colors.line, borderLeftWidth: 1 },
              ]}
            >
              <AppText variant="caption" color={cell.header ? 'muted' : 'ink'} style={cell.header ? styles.bold : undefined}>
                {cell.text}
              </AppText>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/** Mostra texto formatado extraído do HTML: parágrafos com negrito e tabelas. */
export function RichText({ blocks }: { blocks: readonly RichBlock[] }) {
  return (
    <View style={styles.root}>
      {blocks.map((block, i) => (block.kind === 'p' ? <Paragraph key={i} block={block} /> : <Table key={i} block={block} />))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  bold: { fontFamily: fonts.bold },
  table: { borderWidth: 1, borderRadius: radii.md, overflow: 'hidden' },
  row: { flexDirection: 'row' },
  cell: { flex: 1, paddingVertical: spacing.sm, paddingHorizontal: spacing.sm, justifyContent: 'center' },
});
