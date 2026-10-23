import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow, PressableScale } from '@/components';
import type { MochiOutfit } from '@/components/mascot/MochiArt';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { BUY_MESSAGES } from '../journey';
import { buyable, howToGet, ITEMS, priceOf, SLOT_LABELS, SLOTS, type Item, type Slot } from '../items';

type Filter = Slot | 'all';

const FILTERS: readonly { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tudo' },
  ...SLOTS.map((slot) => ({ value: slot as Filter, label: SLOT_LABELS[slot] })),
];

interface ShopViewProps {
  /** Mostra o item no Mochi grande, sem ser dele ainda. */
  onPreview: (preview: MochiOutfit | null) => void;
}

/**
 * Loja do Mochi: itens à venda por pétalas, os de temporada (só na época) e os que só saem por conquista. Tocar num item o
 * mostra no Mochi; comprar desconta as pétalas.
 */
export function ShopView({ onPreview }: ShopViewProps) {
  const { colors } = useTheme();
  const journey = useProgressStore((s) => s.journey);
  const buy = useProgressStore((s) => s.buyJourneyItem);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const now = new Date();

  const list = ITEMS.filter((item) => filter === 'all' || item.slot === filter);
  const forSale = list.filter((i) => i.source.kind === 'shop' || (i.source.kind === 'season' && buyable(i, now)));
  const offSeason = list.filter((i) => i.source.kind === 'season' && !buyable(i, now));
  const rewards = list.filter((i) => i.source.kind === 'achievement' || i.source.kind === 'weekly');

  const select = (item: Item) => {
    setSelected(item.id);
    setMessage(null);
    onPreview({ [item.slot]: item.id });
  };

  const purchase = (item: Item) => {
    const error = buy(item.id);
    if (error) {
      setMessage({ text: BUY_MESSAGES[error], ok: false });
      return;
    }
    setMessage({ text: `${item.name} é seu! Ele já está no Mochi.`, ok: true });
    onPreview(null);
  };

  const row = (item: Item) => {
    const owned = journey.owned.includes(item.id);
    const price = priceOf(item);
    const isSelected = selected === item.id;
    const canBuy = price !== null && buyable(item, now);
    const short = canBuy && !owned && journey.petals < (price ?? 0);
    return (
      <PressableScale
        key={item.id}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}${owned ? ', seu' : ''}`}
        onPress={() => select(item)}
        style={[styles.row, { backgroundColor: colors.surface, borderColor: isSelected ? colors.primary : colors.line, opacity: owned ? 0.75 : 1 }]}
      >
        <View style={styles.flex}>
          <AppText style={styles.name}>{item.name}</AppText>
          <AppText variant="caption" color="muted">
            {SLOT_LABELS[item.slot]} · {item.description}
          </AppText>
          {!owned && !canBuy ? (
            <AppText variant="caption" color="muted">
              {howToGet(item)}
            </AppText>
          ) : null}
        </View>
        {owned ? (
          <AppText color="ok">✓ Seu</AppText>
        ) : canBuy ? (
          <AppText style={styles.price} color={short ? 'muted' : 'primary'}>
            🌸 {price}
          </AppText>
        ) : (
          <AppText color="muted">🔒</AppText>
        )}
      </PressableScale>
    );
  };

  const chosen = ITEMS.find((i) => i.id === selected);
  const chosenOwned = chosen ? journey.owned.includes(chosen.id) : false;
  const chosenPrice = chosen ? priceOf(chosen) : null;

  return (
    <View style={styles.root}>
      <ChipRow options={FILTERS} value={filter} onChange={setFilter} />
      <AppText color="muted">
        Você tem <Bold>🌸 {journey.petals}</Bold>. Pétalas vêm de abrir o app, concluir lições (quanto mais perfeitas, mais),
        missões e conquistas.
      </AppText>

      {chosen ? (
        <Card enterIndex={0}>
          <AppText variant="title">{chosen.name}</AppText>
          <AppText color="muted">{chosen.description}</AppText>
          {chosenOwned ? (
            <AppText color="ok">Você já tem este item. Vista-o em Armário.</AppText>
          ) : chosenPrice !== null && buyable(chosen, now) ? (
            <Button
              label={journey.petals >= chosenPrice ? `Comprar por 🌸 ${chosenPrice}` : `Faltam 🌸 ${chosenPrice - journey.petals}`}
              disabled={journey.petals < chosenPrice}
              onPress={() => purchase(chosen)}
            />
          ) : (
            <AppText color="muted">{howToGet(chosen)}</AppText>
          )}
          {message ? (
            <AppText color={message.ok ? 'ok' : 'bad'} accessibilityLiveRegion="polite">
              {message.text}
            </AppText>
          ) : null}
        </Card>
      ) : (
        <AppText variant="caption" color="muted">
          Toque num item para ver como o Mochi fica.
        </AppText>
      )}

      {forSale.length > 0 ? <AppText variant="title">À venda</AppText> : null}
      {forSale.map(row)}
      {offSeason.length > 0 ? <AppText variant="title">Fora de época</AppText> : null}
      {offSeason.map(row)}
      {rewards.length > 0 ? <AppText variant="title">Só por conquista</AppText> : null}
      {rewards.map(row)}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  flex: { flex: 1, gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1.5, borderRadius: radii.md, padding: spacing.md, minHeight: 64 },
  name: { fontFamily: fonts.bold, fontSize: 17 },
  price: { fontFamily: fonts.bold, fontSize: 17 },
});
