import { useEffect, useState } from 'react';
import { Easing, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { AppText } from './AppText';
import { useMotionEnabled } from './motion';

type AppTextProps = Parameters<typeof AppText>[0];

interface CountUpProps extends Omit<AppTextProps, 'children'> {
  value: number;
  /** Texto depois do número, ex.: "%". */
  suffix?: string;
}

/** Número inteiro que "conta" até o valor ao aparecer e a cada mudança. Sem animação com "reduzir movimento". */
export function CountUp({ value, suffix = '', ...textProps }: CountUpProps) {
  const motion = useMotionEnabled();
  const [shown, setShown] = useState(motion ? 0 : value);
  const progress = useSharedValue(motion ? 0 : value);

  useEffect(() => {
    if (motion) {
      progress.value = withTiming(value, { duration: 700, easing: Easing.out(Easing.cubic) });
    } else {
      progress.value = value;
    }
  }, [value, motion, progress]);

  // Só atualiza o texto quando o inteiro muda (no máximo uma vez por unidade, não a cada quadro).
  useAnimatedReaction(
    () => Math.round(progress.value),
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setShown, current);
    },
  );

  return (
    <AppText {...textProps}>
      {motion ? shown : value}
      {suffix}
    </AppText>
  );
}
