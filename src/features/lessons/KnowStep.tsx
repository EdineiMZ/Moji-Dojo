import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppText, Bold, Button, Card, StrokeAnimation, PressableScale } from '@/components';
import { KANA_EXAMPLES, KANJI_EXAMPLES } from '@/data/examples';
import { KANA_MNEMONICS, KANJI_HINTS } from '@/data/hints';
import { STROKES } from '@/data/strokes';
import { getItem, pronunciationText } from '@/features/catalog';
import { speakJapanese } from '@/features/speech/voiceStore';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { comboExplanation, formatReadings, isCombo } from './knowText';

interface KnowStepProps {
  items: readonly string[];
  pos: number;
  onPosChange: (pos: number) => void;
  /** Rótulo do botão no último caractere ("Ir para a escrita" / "Ir para o teste"). */
  finishLabel: string;
  onFinish: () => void;
}

const MAX_GLYPH = 260;

/** Passo 1 da lição: ver o caractere, ouvir, ver os traços e ler a dica de memorização. */
export function KnowStep({ items, pos, onPosChange, finishLabel, onFinish }: KnowStepProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [replay, setReplay] = useState(0);

  const char = items[pos] ?? '';
  const item = getItem(char);
  const strokes = STROKES[char];
  const glyphSize = Math.min(width - spacing.lg * 4, MAX_GLYPH);
  const mnemonic = KANA_MNEMONICS[char] ?? KANJI_HINTS[char];
  const isLast = pos === items.length - 1;
  const strokeCount = strokes?.p.length ?? 0;

  const kanaExample = KANA_EXAMPLES[char];
  const kanjiExample = KANJI_EXAMPLES[char];

  return (
    <View style={styles.root}>
      {pos === 0 ? (
        <AppText color="muted">
          Passo 1: conheça cada caractere. Ouça o som, veja a ordem dos traços e leia a dica. Não precisa decorar agora:
          o teste e as revisões fazem isso por você.
        </AppText>
      ) : null}

      {/* A chave refaz a entrada com mola a cada caractere novo. */}
      <Card key={char} enterIndex={0} style={styles.card}>
        <View
          style={[
            styles.glyphBox,
            { width: glyphSize, height: glyphSize, backgroundColor: colors.background, borderColor: colors.line },
          ]}
        >
          {strokes && !isCombo(item) ? (
            <StrokeAnimation strokes={strokes} size={glyphSize - 8} replayKey={replay} />
          ) : (
            <AppText variant="glyph" style={{ fontSize: glyphSize * 0.5, lineHeight: glyphSize * 0.62 }}>
              {char}
            </AppText>
          )}
        </View>

        <View style={styles.info}>
          {item.script === 'kanji' ? (
            <>
              <AppText variant="headline" center>
                {item.label}
              </AppText>
              <AppText center color="muted">
                leitura on <Bold>{formatReadings(item.on)}</Bold> · leitura kun <Bold>{formatReadings(item.kun)}</Bold>
              </AppText>
              {kanjiExample ? (
                <PressableScale accessibilityRole="button" onPress={() => speakJapanese(kanjiExample.reading)}>
                  <AppText center>
                    <Bold>{kanjiExample.word}</Bold> ({kanjiExample.reading}) {kanjiExample.meaning} 🔊
                  </AppText>
                </PressableScale>
              ) : null}
            </>
          ) : (
            <>
              <AppText variant="headline" center>
                {item.label}
              </AppText>
              {isCombo(item) ? (
                <AppText center color="muted">
                  {comboExplanation(item)}
                </AppText>
              ) : null}
              {kanaExample ? (
                <PressableScale accessibilityRole="button" onPress={() => speakJapanese(kanaExample.word)}>
                  <AppText center>
                    Exemplo: <Bold>{kanaExample.word}</Bold> {kanaExample.romaji}, {kanaExample.meaning} 🔊
                  </AppText>
                </PressableScale>
              ) : null}
            </>
          )}

          {mnemonic ? (
            <View style={[styles.mnemonic, { backgroundColor: colors.lilacSoft }]}>
              <AppText variant="caption" color="muted">
                PARA LEMBRAR
              </AppText>
              <AppText>{mnemonic}</AppText>
            </View>
          ) : null}

          {strokeCount ? (
            <AppText variant="caption" color="muted" center>
              {strokeCount} {strokeCount === 1 ? 'traço' : 'traços'}. Siga a ordem dos números, cada traço na direção em
              que é desenhado.
            </AppText>
          ) : null}

          <View style={styles.actions}>
            <Button
              label={item.script === 'kanji' ? '🔊 Ouvir leitura' : '🔊 Ouvir'}
              onPress={() => speakJapanese(pronunciationText(item))}
            />
            {strokes && !isCombo(item) ? (
              <Button label="Ver traços de novo" variant="soft" onPress={() => setReplay((r) => r + 1)} />
            ) : null}
          </View>
        </View>
      </Card>

      <View style={styles.nav}>
        <Button label="Anterior" variant="ghost" disabled={pos === 0} onPress={() => onPosChange(pos - 1)} style={styles.navButton} />
        <AppText color="muted">
          {pos + 1} de {items.length}
        </AppText>
        <Button
          label={isLast ? finishLabel : 'Próximo'}
          onPress={() => (isLast ? onFinish() : onPosChange(pos + 1))}
          style={styles.navButton}
        />
      </View>

      <View style={styles.dots}>
        {items.map((c, i) => (
          <PressableScale
            key={c}
            accessibilityRole="button"
            accessibilityLabel={`Ir para ${c}`}
            onPress={() => onPosChange(i)}
            style={[
              styles.dot,
              { backgroundColor: i === pos ? colors.primary : colors.surface, borderColor: colors.line },
            ]}
          >
            <AppText
             
              style={{ fontFamily: fonts.bold, fontSize: 16 }}
              color={i === pos ? 'onPrimary' : 'ink'}
            >
              {c}
            </AppText>
          </PressableScale>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  card: { alignItems: 'center' },
  glyphBox: {
    borderWidth: 1.5,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { alignSelf: 'stretch', gap: spacing.sm, alignItems: 'stretch' },
  mnemonic: { borderRadius: radii.md, padding: spacing.md, gap: 2 },
  actions: { gap: spacing.sm, marginTop: spacing.xs },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  navButton: { paddingHorizontal: spacing.lg, minHeight: 44 },
  dots: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  dot: { minWidth: 40, height: 40, borderRadius: radii.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.sm },
});
