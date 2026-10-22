import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { AppText } from './AppText';
import { Mascot } from './mascot/Mascot';
import { PetalRain } from './PetalRain';
import { ReduceMotion, useMotionEnabled } from './motion';

const DOT_COUNT = 3;

/** Um ponto que sobe e desce, em sequência com os vizinhos ("carregando..."). */
function Dot({ index, color }: { index: number; color: string }) {
  const motion = useMotionEnabled();
  const lift = useSharedValue(0);

  useEffect(() => {
    if (!motion) return;
    lift.value = withDelay(
      index * 160,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 420, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 420, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 400 }),
        ),
        -1,
      ),
    );
  }, [index, lift, motion]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: lift.value }] }));
  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />;
}

/**
 * Tela de carregamento: o Mochi pulando de alegria, o nome do app e três pontinhos, com pétalas de
 * sakura caindo ao fundo. Cobre o app inteiro (use como sobreposição) e some com um fade.
 */
export function LoadingScreen() {
  const { colors } = useTheme();

  return (
    <Animated.View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Carregando o Moji Dojo"
      entering={FadeIn.duration(150).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(450).reduceMotion(ReduceMotion.System)}
      style={StyleSheet.absoluteFill}
    >
      <LinearGradient colors={colors.backgroundGradient} style={styles.fill}>
        <PetalRain count={10} />
        <View style={styles.center}>
          <Mascot mood="cheer" size={180} />
          <View style={styles.titles}>
            <AppText style={styles.title}>Moji Dojo</AppText>
            <AppText variant="body" color="muted">
              もじどうじょう
            </AppText>
          </View>
          <View style={styles.dots}>
            {Array.from({ length: DOT_COUNT }, (_, i) => (
              <Dot key={i} index={i} color={colors.chart} />
            ))}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  titles: { alignItems: 'center', gap: 2 },
  title: { fontFamily: fonts.bold, fontSize: 36, lineHeight: 44 },
  dots: { flexDirection: 'row', gap: spacing.sm, height: 20, alignItems: 'flex-end' },
  dot: { width: 10, height: 10, borderRadius: radii.pill },
});
