import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, BackLink, ChipRow, Screen } from '@/components';
import type { MochiOutfit } from '@/components/mascot/MochiArt';
import { MochiHeader } from '@/features/journey/ui/MochiHeader';
import { ShopView } from '@/features/journey/ui/ShopView';
import { WardrobeView } from '@/features/journey/ui/WardrobeView';
import { spacing } from '@/theme';

type Tab = 'wardrobe' | 'shop';

const TABS = [
  { value: 'wardrobe' as const, label: 'Armário' },
  { value: 'shop' as const, label: 'Loja' },
];

/** Meu Mochi: o Mochi com a roupa atual, o armário para vestir e a loja para comprar itens com pétalas. */
export default function MochiScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('wardrobe');
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
        options={TABS}
        value={tab}
        onChange={(next) => {
          setTab(next);
          setPreview(null);
        }}
      />
      {tab === 'wardrobe' ? <WardrobeView /> : <ShopView onPreview={setPreview} />}
    </Screen>
  );
}

const styles = StyleSheet.create({ header: { gap: spacing.sm } });
