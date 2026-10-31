import { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
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
import { AppText, Bold, Button, Card, Mascot, PetalRain, useMotionEnabled } from '@/components';
import type { MochiOutfit } from '@/components/mascot/MochiArt';
import { formatDay } from '@/features/streak/days';
import { useProgressStore, useSettingsStore } from '@/store';
import { radii, spacing, useTheme } from '@/theme';
import { dailyChestText } from '../chestCopy';
import { useChestUi } from '../chestUi';
import { findItem, RARITY_LABELS } from '../items';
import { outfit as outfitOf } from '../journey';
import type { Loot } from '../loot';
import { WEEKLY_DAYS_GOAL } from '../missions';
import { daysStudiedInWeek } from '../week';
import { rarityStyle } from './rarity';

type Kind = 'daily' | 'weekly';

const TITLES: Readonly<Record<Kind, string>> = { daily: 'Baú do dia', weekly: 'Baú da semana' };

/** O baú que balança esperando para ser aberto, e que "estoura" quando abre. */
function ChestArt({ opened, rarityGlow }: { opened: boolean; rarityGlow: string | null }) {
  const motion = useMotionEnabled();
  const tilt = useSharedValue(0);
  const scale = useSharedValue(1);
  useEffect(() => {
    cancelAnimation(tilt);
    cancelAnimation(scale);
    if (!motion) return;
    if (!opened) {
      tilt.value = withRepeat(
        withSequence(withTiming(-7, { duration: 150 }), withTiming(7, { duration: 150 }), withTiming(-5, { duration: 130 }), withTiming(0, { duration: 130 }), withTiming(0, { duration: 900 })),
        -1,
      );
      scale.value = withRepeat(withSequence(withTiming(1.05, { duration: 700, easing: Easing.inOut(Easing.sin) }), withTiming(1, { duration: 700, easing: Easing.inOut(Easing.sin) })), -1);
    } else {
      tilt.value = withTiming(0, { duration: 120 });
      scale.value = withSequence(withTiming(1.35, { duration: 160 }), withSpring(1, { damping: 5, stiffness: 140 }));
    }
  }, [opened, motion, tilt, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${tilt.value}deg` }, { scale: scale.value }] }));
  return (
    <Animated.View style={[styles.chest, style, rarityGlow ? { backgroundColor: rarityGlow } : null]}>
      <AppText style={styles.chestEmoji}>{opened ? '✨' : '🎁'}</AppText>
    </Animated.View>
  );
}

/**
 * O baú do dia (ao abrir o app pela primeira vez no dia) e o da semana (quando a meta de dias é batida). Aparece por cima do
 * app: toque em "Abrir" e o sorteio revela pétalas e, às vezes, um item exclusivo, com a raridade e o Mochi vestido com ele.
 * "Depois" deixa o baú esperando até o dia seguinte, mesmo se o app for fechado e aberto (o cartão da tela inicial e a aba de metas reabrem).
 */
export function ChestHost() {
  const { colors } = useTheme();
  const onboarded = useSettingsStore((s) => s.profile.onboarded);
  const journey = useProgressStore((s) => s.journey);
  const days = useProgressStore((s) => s.days);
  const openDaily = useProgressStore((s) => s.openDailyChest);
  const claimWeekly = useProgressStore((s) => s.claimWeekChest);
  const askWeek = useProgressStore((s) => s.askWeekChest);
  const askDaily = useProgressStore((s) => s.askDailyChest);
  const equip = useProgressStore((s) => s.equipJourneyItem);
  const requested = useChestUi((s) => s.requested);
  const clearRequest = useChestUi((s) => s.clear);

  const [later, setLater] = useState<string | null>(null);
  const [loot, setLoot] = useState<Loot | null>(null);
  const [equipped, setEquipped] = useState(false);

  const today = formatDay(new Date());
  const weekReady = useMemo(() => daysStudiedInWeek(days, new Date()) >= WEEKLY_DAYS_GOAL && !journey.week.claimed, [days, journey.week.claimed]);
  const dailyReady = journey.today.day === today && journey.today.chest === 'ready';

  // Qual baú mostrar: o pedido do aluno, senão o do dia (uma vez por abertura), senão o da semana (uma vez por dia).
  let kind: Kind | null = null;
  if (loot) kind = loot.kind;
  else if (requested === 'daily' && dailyReady) kind = 'daily';
  else if (requested === 'weekly' && weekReady) kind = 'weekly';
  else if (dailyReady && !journey.today.dailyAsked && later !== `${today}:daily`) kind = 'daily';
  else if (!dailyReady && weekReady && !journey.today.weekAsked && later !== `${today}:weekly`) kind = 'weekly';

  if (!onboarded || kind === null) return null;

  const item = loot?.itemId ? findItem(loot.itemId) : undefined;
  const style = loot ? rarityStyle(loot.rarity, colors) : null;
  const preview: MochiOutfit | undefined = item ? { ...outfitOf(journey, new Date()), [item.slot]: item.id } : undefined;
  const big = loot && (loot.rarity === 'epic' || loot.rarity === 'legendary');

  const open = () => {
    const result = kind === 'daily' ? openDaily() : claimWeekly();
    if (result) setLoot(result);
  };
  const close = () => {
    clearRequest();
    setLoot(null);
    setEquipped(false);
  };
  const postpone = () => {
    if (kind === 'weekly') askWeek();
    else askDaily();
    setLater(`${today}:${kind}`);
    clearRequest();
  };

  return (
    <Modal transparent animationType="fade" visible onRequestClose={loot ? close : postpone}>
      <View style={[styles.backdrop, { backgroundColor: 'rgba(20,16,40,0.6)' }]}>
        <Card style={styles.card}>
          <AppText variant="headline" center>
            {TITLES[kind]}
          </AppText>
          {!loot ? (
            <>
              <Mascot mood="excited" size={110} />
              <ChestArt opened={false} rarityGlow={null} />
              <AppText center color="muted">
                {kind === 'daily'
                  ? dailyChestText(days.length <= 1)
                  : `Você estudou em ${WEEKLY_DAYS_GOAL} dias desta semana! Este baú tem sempre um item exclusivo.`}
              </AppText>
              <Button label="Abrir o baú" onPress={open} />
              <Button label="Depois" variant="ghost" onPress={postpone} />
            </>
          ) : (
            <>
              <Mascot mood={big ? 'cheer' : item ? 'love' : 'surprised'} size={item ? 170 : 110} {...(preview ? { outfit: preview } : {})} />
              <ChestArt opened rarityGlow={style?.bg ?? null} />
              {style ? (
                <View style={[styles.badge, { borderColor: style.fg, backgroundColor: style.bg }]}>
                  <AppText>
                    <Bold>
                      {RARITY_LABELS[loot.rarity]} {style.stars}
                    </Bold>
                  </AppText>
                </View>
              ) : null}
              <AppText variant="title" center>
                🌸 +{loot.petals} pétalas
              </AppText>
              {item ? (
                <View style={styles.itemBox}>
                  <AppText center>
                    Item exclusivo: <Bold>{item.name}</Bold>
                  </AppText>
                  <AppText variant="caption" color="muted" center>
                    {item.description}
                  </AppText>
                  {equipped ? (
                    <AppText color="ok">Vestido!</AppText>
                  ) : (
                    <Button
                      label="Vestir agora"
                      variant="soft"
                      onPress={() => {
                        equip(item.id);
                        setEquipped(true);
                      }}
                    />
                  )}
                </View>
              ) : (
                <AppText variant="caption" color="muted" center>
                  Só pétalas desta vez. Continue estudando: os itens exclusivos saem nos baús, cada vez com mais chance.
                </AppText>
              )}
              <Button label="Fechar" onPress={close} />
              {item || big ? <PetalRain count={big ? 28 : 16} /> : null}
            </>
          )}
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: { alignSelf: 'stretch', alignItems: 'center', gap: spacing.md },
  chest: { width: 96, height: 96, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  chestEmoji: { fontSize: 64, lineHeight: 80 },
  badge: { borderWidth: 2, borderRadius: radii.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  itemBox: { alignSelf: 'stretch', alignItems: 'center', gap: spacing.xs },
});
