import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Card } from '@/components';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { averageCpm, keyHeat, weakChars } from './typingStats';

/** Mapa do teclado: cada tecla mais vermelha quanto mais você erra nela, e a velocidade média. */
export function KeyHeatmap() {
  const { colors } = useTheme();
  const typing = useProgressStore((s) => s.typing);
  const heat = keyHeat(typing);
  const tried = heat.some((h) => h.tries > 0);
  const weak = weakChars(typing, 6);
  const average = averageCpm(typing);
  const slowest = [...heat].filter((h) => h.avgMs > 0).sort((a, b) => b.avgMs - a.avgMs)[0];

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Seu desempenho</AppText>
      <View style={styles.numbers}>
        <Stat label="Média" value={average ? `${average}/min` : '–'} />
        <Stat label="Recorde" value={typing.best ? `${typing.best}/min` : '–'} />
        <Stat label="Letras" value={String(typing.chars)} />
      </View>

      {tried ? (
        <>
          <View style={styles.grid} accessibilityLabel="Mapa de erros por tecla">
            {heat.map((h) => {
              const strength = Math.min(h.rate * 2, 1);
              return (
                <View
                  key={h.label}
                  style={[
                    styles.cell,
                    { borderColor: colors.line, backgroundColor: h.tries === 0 ? colors.lilacSoft : mix(colors.okSoft, colors.badSoft, strength) },
                  ]}
                >
                  <AppText style={styles.cellLabel}>{h.label === 'mod' ? '小゛゜' : h.label}</AppText>
                  <AppText variant="caption" color="muted">
                    {h.tries === 0 ? '–' : `${h.bad} erro${h.bad === 1 ? '' : 's'}`}
                  </AppText>
                </View>
              );
            })}
          </View>
          <AppText variant="caption" color="muted">
            Verde: acerta. Vermelho: erra mais.
            {slowest ? ` A tecla mais lenta é ${slowest.label === 'mod' ? '小゛゜' : slowest.label} (${(slowest.avgMs / 1000).toFixed(1)} s por letra).` : ''}
          </AppText>
          {weak.length > 0 ? (
            <AppText>
              Letras para treinar: <Bold>{weak.join(' ')}</Bold>. O modo <Bold>Pontos fracos</Bold> usa só essas.
            </AppText>
          ) : null}
        </>
      ) : (
        <AppText color="muted">Treine nos níveis e o mapa aparece aqui, mostrando onde você erra e em que teclas é mais lento.</AppText>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.number}>
      <AppText variant="title">{value}</AppText>
      <AppText variant="caption" color="muted">
        {label}
      </AppText>
    </View>
  );
}

/** Mistura duas cores `#RRGGBB` (0 = a primeira, 1 = a segunda). */
function mix(a: string, b: string, t: number): string {
  const parse = (hex: string): [number, number, number] => {
    const v = hex.replace('#', '');
    const n = parseInt(v.length === 3 ? v.replace(/(.)/g, '$1$1') : v, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const channel = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${channel(ar, br)}, ${channel(ag, bg)}, ${channel(ab, bb)})`;
}

const styles = StyleSheet.create({
  numbers: { flexDirection: 'row', justifyContent: 'space-between' },
  number: { alignItems: 'center', flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cell: { width: '30.5%', flexGrow: 1, minHeight: 56, borderRadius: radii.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', padding: spacing.xs },
  cellLabel: { fontFamily: fonts.bold, fontSize: 20 },
});
