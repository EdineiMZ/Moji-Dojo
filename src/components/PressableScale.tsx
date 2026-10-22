import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { hapticLight } from '@/lib/haptics';
import { playSfx } from '@/lib/sfx';
import { SPRING, useMotionEnabled } from './motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** O quanto encolhe ao tocar (1 = nada). */
  scaleTo?: number;
  /** Vibração leve ao tocar (respeita o interruptor de Ajustes). */
  haptic?: boolean;
  /** Som de toque (respeita o interruptor de Ajustes). Desligue onde o toque já tem outro som. */
  sound?: boolean;
}

/**
 * Substituto direto do Pressable que "afunda" ao tocar, com mola. Com "reduzir movimento"
 * não anima: só fica um pouco transparente enquanto o dedo está em cima.
 */
export function PressableScale({
  scaleTo = 0.97,
  haptic = false,
  sound = true,
  style,
  onPress,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  const motion = useMotionEnabled();
  const pressed = useSharedValue(0);

  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - (1 - scaleTo) * pressed.value }],
    opacity: motion ? 1 : 1 - 0.2 * pressed.value,
  }));

  const set = (to: 0 | 1) => {
    pressed.value = motion ? withSpring(to, SPRING) : to;
  };

  return (
    <AnimatedPressable
      {...rest}
      style={[style, animated]}
      onPress={(e) => {
        if (haptic) hapticLight();
        if (sound) playSfx('tap');
        onPress?.(e);
      }}
      onPressIn={(e) => {
        set(1);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        set(0);
        onPressOut?.(e);
      }}
    >
      {children}
    </AnimatedPressable>
  );
}
