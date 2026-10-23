import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
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
import { hapticLight } from '@/lib/haptics';
import { useMotionEnabled } from '../motion';
import { outfit as outfitOf } from '@/features/journey/journey';
import { useProgressStore } from '@/store';
import { MochiArt, type MascotMood, type MochiOutfit } from './MochiArt';

export type { MascotMood };

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  /** Roupa a mostrar (a prévia da loja e do armário). Sem isto, usa o que o aluno está vestindo. */
  outfit?: MochiOutfit;
  /** Tocar no Mochi faz ele reagir (pula, gira, muda de humor por um instante). */
  interactive?: boolean;
}

const MOOD_LABEL: Record<MascotMood, string> = {
  neutral: 'Mochi, o gatinho',
  happy: 'Mochi, o gatinho, feliz',
  sad: 'Mochi, o gatinho, triste',
  cheer: 'Mochi, o gatinho, comemorando',
  sleepy: 'Mochi, o gatinho, com sono',
  surprised: 'Mochi, o gatinho, surpreso',
  love: 'Mochi, o gatinho, apaixonado',
  thinking: 'Mochi, o gatinho, pensando',
  proud: 'Mochi, o gatinho, orgulhoso',
  wink: 'Mochi, o gatinho, piscando',
  excited: 'Mochi, o gatinho, animado',
};

/** Humores em que o Mochi pisca de vez em quando (os de olho aberto). */
const BLINKS: ReadonlySet<MascotMood> = new Set(['neutral', 'sad', 'surprised', 'thinking']);

/** Humores que o Mochi mostra por um instante quando se toca nele. */
const TAP_MOODS: readonly MascotMood[] = ['love', 'wink', 'surprised', 'excited', 'happy'];

/** Pisca: de 2,5 a 5,5 s entre uma piscada e outra, com os olhos fechados por 140 ms. */
function useBlink(enabled: boolean, motion: boolean): boolean {
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    if (!enabled || !motion) return;
    let open: ReturnType<typeof setTimeout>;
    let shut: ReturnType<typeof setTimeout>;
    const schedule = () => {
      open = setTimeout(() => {
        setClosed(true);
        shut = setTimeout(() => {
          setClosed(false);
          schedule();
        }, 140);
      }, 2500 + Math.random() * 3000);
    };
    schedule();
    return () => {
      clearTimeout(open);
      clearTimeout(shut);
      setClosed(false);
    };
  }, [enabled, motion]);
  return closed;
}

/**
 * Mochi, o mascote. Cada humor tem seu movimento: neutro respira e pisca; feliz dá um pulinho; triste balança a cabeça;
 * comemorando e animado pulam sem parar; com sono balança devagar; surpreso dá um pulo de susto; apaixonado bate como um
 * coração; pensando inclina a cabeça; orgulhoso estufa o peito; piscando inclina de lado. Tocando nele (quando `interactive`)
 * ele reage: pula, gira ou se espreme e mostra um humor por um instante. Com "reduzir movimento" o desenho fica parado.
 */
export function Mascot({ mood = 'neutral', size = 160, outfit, interactive = false }: MascotProps) {
  const equipped = useProgressStore((s) => s.journey.equipped);
  const owned = useProgressStore((s) => s.journey.owned);
  const seasonalAuto = useProgressStore((s) => s.journey.seasonalAuto);
  const worn = outfit ?? outfitOf({ equipped, owned, seasonalAuto }, new Date());
  const motion = useMotionEnabled();
  const [flash, setFlash] = useState<MascotMood | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shown = flash ?? mood;
  const blink = useBlink(BLINKS.has(shown), motion);

  const lift = useSharedValue(0);
  const tilt = useSharedValue(0);
  const squash = useSharedValue(1);
  const grow = useSharedValue(1);
  const spin = useSharedValue(0);
  const tapLift = useSharedValue(0);
  const tapSquash = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(lift);
    cancelAnimation(tilt);
    cancelAnimation(squash);
    cancelAnimation(grow);
    lift.value = 0;
    tilt.value = 0;
    squash.value = 1;
    grow.value = 1;
    if (!motion) return;

    const up = Easing.out(Easing.quad);
    const down = Easing.in(Easing.quad);
    const sine = Easing.inOut(Easing.sin);
    switch (shown) {
      case 'neutral':
        squash.value = withRepeat(withSequence(withTiming(1.025, { duration: 1800, easing: sine }), withTiming(1, { duration: 1800, easing: sine })), -1);
        break;
      case 'happy':
        lift.value = withSequence(withTiming(-9, { duration: 260, easing: up }), withTiming(0, { duration: 340, easing: down }));
        break;
      case 'sad':
        tilt.value = withSequence(withTiming(-3, { duration: 220, easing: sine }), withTiming(3, { duration: 280, easing: sine }), withTiming(-1.5, { duration: 240, easing: sine }), withTiming(0, { duration: 220, easing: sine }));
        squash.value = withTiming(0.97, { duration: 600 });
        break;
      case 'sleepy':
        tilt.value = withRepeat(withSequence(withTiming(-3, { duration: 2200, easing: sine }), withTiming(3, { duration: 2200, easing: sine })), -1, true);
        squash.value = withRepeat(withSequence(withTiming(1.03, { duration: 2400, easing: sine }), withTiming(0.98, { duration: 2400, easing: sine })), -1, true);
        break;
      case 'surprised':
        grow.value = withSequence(withTiming(1.14, { duration: 120, easing: up }), withSpring(1, { damping: 6, stiffness: 160 }));
        lift.value = withSequence(withTiming(-14, { duration: 140, easing: up }), withSpring(0, { damping: 7, stiffness: 150 }));
        break;
      case 'love':
        grow.value = withRepeat(withSequence(withTiming(1.06, { duration: 280, easing: up }), withTiming(1, { duration: 280, easing: down }), withTiming(1.04, { duration: 220, easing: up }), withTiming(1, { duration: 640, easing: down })), -1);
        break;
      case 'thinking':
        tilt.value = withSequence(withTiming(-5, { duration: 500, easing: sine }), withTiming(-4, { duration: 1800, easing: sine }), withTiming(0, { duration: 600, easing: sine }));
        break;
      case 'proud':
        grow.value = withSequence(withTiming(1.07, { duration: 420, easing: up }), withTiming(1.05, { duration: 900, easing: sine }));
        lift.value = withSequence(withTiming(-6, { duration: 300, easing: up }), withTiming(-2, { duration: 500, easing: down }));
        break;
      case 'wink':
        tilt.value = withSequence(withTiming(5, { duration: 200, easing: sine }), withTiming(4, { duration: 700, easing: sine }), withTiming(0, { duration: 300, easing: sine }));
        break;
      case 'excited':
        lift.value = withRepeat(withSequence(withTiming(-13, { duration: 280, easing: up }), withTiming(0, { duration: 280, easing: down })), -1);
        tilt.value = withRepeat(withSequence(withTiming(-3, { duration: 280, easing: sine }), withTiming(3, { duration: 280, easing: sine })), -1, true);
        break;
      default:
        // cheer
        lift.value = withRepeat(withSequence(withTiming(-11, { duration: 420, easing: up }), withTiming(0, { duration: 420, easing: down })), -1);
        tilt.value = withRepeat(withSequence(withTiming(-2.5, { duration: 420, easing: sine }), withTiming(2.5, { duration: 420, easing: sine })), -1, true);
    }
  }, [shown, motion, lift, tilt, squash, grow]);

  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    [],
  );

  const react = useCallback(() => {
    hapticLight();
    const mood2 = TAP_MOODS[Math.floor(Math.random() * TAP_MOODS.length)] ?? 'happy';
    setFlash(mood2);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 1600);
    if (!motion) return;
    const trick = Math.floor(Math.random() * 4);
    cancelAnimation(tapLift);
    cancelAnimation(spin);
    cancelAnimation(tapSquash);
    if (trick === 0) {
      tapLift.value = withSequence(withTiming(-20, { duration: 200, easing: Easing.out(Easing.quad) }), withSpring(0, { damping: 6, stiffness: 140 }));
    } else if (trick === 1) {
      spin.value = 0;
      spin.value = withTiming(360, { duration: 520, easing: Easing.inOut(Easing.quad) }, () => {
        spin.value = 0;
      });
    } else if (trick === 2) {
      tapSquash.value = withSequence(withTiming(0.82, { duration: 120 }), withSpring(1, { damping: 4, stiffness: 180 }));
    } else {
      spin.value = withSequence(withTiming(-12, { duration: 90 }), withTiming(12, { duration: 140 }), withTiming(-8, { duration: 120 }), withTiming(0, { duration: 100 }));
    }
  }, [motion, tapLift, spin, tapSquash]);

  const animated = useAnimatedStyle(() => ({
    transform: [
      { translateY: lift.value + tapLift.value },
      { rotate: `${tilt.value + spin.value}deg` },
      { scaleY: squash.value * tapSquash.value },
      { scale: grow.value },
    ],
  }));

  const art = (
    <Animated.View accessible accessibilityRole="image" accessibilityLabel={MOOD_LABEL[shown]} style={animated}>
      <MochiArt mood={shown} size={size} outfit={worn} blink={blink} />
    </Animated.View>
  );
  if (!interactive) return art;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Fazer carinho no Mochi" onPress={react}>
      {art}
    </Pressable>
  );
}
