import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText, BackLink, ChipRow, Screen } from '@/components';
import type { MochiOutfit } from '@/components/mascot/MochiArt';
import { HomeView } from '@/features/home/ui/HomeView';
import { AchievementsView } from '@/features/journey/ui/AchievementsView';
import { GoalsView } from '@/features/journey/ui/GoalsView';
import { MochiHeader } from '@/features/journey/ui/MochiHeader';
import { ShopView } from '@/features/journey/ui/ShopView';
import { SummaryView } from '@/features/journey/ui/SummaryView';
import { WardrobeView } from '@/features/journey/ui/WardrobeView';
import { spacing } from '@/theme';

type Tab = 'wardrobe' | 'shop' | 'home' | 'achievements' | 'goals' | 'summary';

const TABS = [
  { value: 'wardrobe' as const, label: 'Armário' },
  { value: 'shop' as const, label: 'Loja' },
  { value: 'home' as const, label: 'Casa' },
  { value: 'achievements' as const, label: 'Conquistas' },
  { value: 'goals' as const, label: 'Metas' },
  { value: 'summary' as const, label: 'Resumo' },
];

/** Meu Mochi: o Mochi, o armário, a loja, a casa, as conquistas, as metas e o resumo do estudo. */
export default function MochiScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const first = TABS.find((t) => t.value === params.tab)?.value ?? 'wardrobe';
  const [tab, setTab] = useState<Tab>(first);
  const [preview, setPreview] = useState<MochiOutfit | null>(null);
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen>
      <View style={styles.header}>
        <BackLink label="← Voltar" onPress={goBack} />
        <AppText variant="headline">Meu Mochi</AppText>
      </View>
      <MochiHeader preview={tab === 'shop' ? preview : null} />
      <ChipRow
        wrap
        options={TABS}
        value={tab}
        onChange={(next) => {
          setTab(next);
          setPreview(null);
        }}
      />
      {tab === 'wardrobe' ? <WardrobeView /> : null}
      {tab === 'shop' ? <ShopView onPreview={setPreview} /> : null}
      {tab === 'home' ? <HomeView /> : null}
      {tab === 'achievements' ? <AchievementsView /> : null}
      {tab === 'goals' ? <GoalsView /> : null}
      {tab === 'summary' ? <SummaryView /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({ header: { gap: spacing.sm } });
