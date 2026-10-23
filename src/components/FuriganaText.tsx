import { StyleSheet, View } from 'react-native';
import type { RubySegment } from '@/data/types';
import { fonts } from '@/theme';
import { AppText } from './AppText';

interface FuriganaTextProps {
  segments: readonly RubySegment[];
  /** Mostra a leitura pequena sobre os kanji. */
  showReading: boolean;
  size?: number;
}

/**
 * Frase com kanji e furigana. O React Native não tem ruby, então cada trecho é uma coluna (leitura em cima,
 * texto embaixo) e as colunas correm em linha, quebrando entre os trechos. Sem furigana, só o texto.
 */
export function FuriganaText({ segments, showReading, size = 18 }: FuriganaTextProps) {
  const rubySize = Math.round(size * 0.55);
  return (
    <View style={styles.row} accessibilityLabel={segments.map((s) => s.reading ?? s.text).join('')}>
      {segments.map((segment, i) => (
        <View key={`${i}-${segment.text}`} style={styles.column} importantForAccessibility="no-hide-descendants">
          {showReading ? (
            // Trechos sem leitura levam uma linha vazia, para a base de todos ficar na mesma altura.
            <AppText
              color="muted"
              style={{ fontSize: rubySize, lineHeight: rubySize + 4, fontFamily: fonts.regular, opacity: segment.reading ? 1 : 0 }}
            >
              {segment.reading ?? ' '}
            </AppText>
          ) : null}
          <AppText style={{ fontFamily: fonts.bold, fontSize: size, lineHeight: Math.round(size * 1.35) }}>{segment.text}</AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' },
  column: { alignItems: 'center' },
});
