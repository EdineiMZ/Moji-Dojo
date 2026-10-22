import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SPRING, useMotionEnabled } from '../motion';
import { MochiArt, type MascotMood } from './MochiArt';

export type { MascotMood };

interface MascotProps {
  mood?: MascotMood;
  size?: number;
}

const MOOD_LABEL: Record<MascotMood, string> = {
  neutral: 'Mochi, o gatinho',
  happy: 'Mochi, o gatinho, feliz',
  sad: 'Mochi, o gatinho, triste',
  cheer: 'Mochi, o gatinho, comemorando',
};

/**
 * Mochi, o mascote. Cada humor tem seu movimento:
 * neutro respira, feliz dá um pulinho, triste balança a cabeça, comemorando pula sem parar.
 * Com "reduzir movimento" o desenho fica parado.
 */
export function Mascot({ mood = 'neutral', size = 160 }: MascotProps) {
  const motion = useMotionEnabled();
  const lift = useSharedValue(0);
  const tilt = useSharedValue(0);
  const squash = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(lift);
    cancelAnimation(tilt);
    cancelAnimation(squash);
    lift.value = 0;
    tilt.value = 0;
    squash.value = 1;
    if (!motion) return;

    const up = Easing.out(Easing.quad);
    const down = Easing.in(Easing.quad);
    if (mood === 'neutral') {
      squash.value = withRepeat(
        withSequence(
          withTiming(1.035, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      );
    } else if (mood === 'happy') {
      lift.value = withSequence(withSpring(-18, SPRING), withSpring(0, SPRING));
    } else if (mood === 'sad') {
      tilt.value = withSequence(
        withTiming(-5, { duration: 140 }),
        withTiming(5, { duration: 140 }),
        withTiming(-3, { duration: 140 }),
        withTiming(0, { duration: 140 }),
      );
      squash.value = withTiming(0.96, { duration: 500 });
    } else {
      lift.value = withRepeat(
        withSequence(withTiming(-22, { duration: 320, easing: up }), withTiming(0, { duration: 320, easing: down })),
        -1,
      );
      tilt.value = withRepeat(
        withSequence(withTiming(-4, { duration: 320 }), withTiming(4, { duration: 320 })),
        -1,
        true,
      );
    }
  }, [mood, motion, lift, tilt, squash]);

  const animated = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }, { rotate: `${tilt.value}deg` }, { scaleY: squash.value }],
  }));

  return (
    <Animated.View accessible accessibilityRole="image" accessibilityLabel={MOOD_LABEL[mood]} style={animated}>
      <MochiArt mood={mood} size={size} />
    </Animated.View>
  );
}
