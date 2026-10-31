import { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { AppText, Bold, Button, Card, ChipRow, Mascot, PetalRain, PressableScale, useScrollIntoView } from '@/components';
import { MochiArt, type MochiOutfit } from '@/components/mascot/MochiArt';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { BUY_MESSAGES, outfit as outfitOf } from '../journey';
import { buyable, howToGet, ITEMS, priceOf, RARITIES, RARITY_LABELS, SLOTS, type Item, type Rarity, type Slot } from '../items';
import { rarityStyle } from './rarity';

type Category = Slot | 'all' | 'seasons' | 'collection';
type Show = 'all' | 'can' | 'mine';
type Sort = 'default' | 'price' | 'rarity';

const CATEGORY_LABELS: Readonly<Record<Slot, string>> = { head: 'Cabeça', face: 'Rosto', neck: 'Pescoço', back: 'Fundos', tint: 'Cores', skin: 'Peles' };

const CATEGORIES: readonly { value: Category; label: string }[] = [
  { value: 'all', label: 'Tudo' },
  ...SLOTS.map((slot) => ({ value: slot as Category, label: CATEGORY_LABELS[slot] })),
  { value: 'seasons', label: 'Datas' },
  { value: 'collection', label: 'Coleção rara' },
];

const SHOWS: readonly { value: Show; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'can', label: 'Posso comprar' },
  { value: 'mine', label: 'Meus' },
];

const SORTS: readonly { value: Sort; label: string }[] = [
  { value: 'default', label: 'Padrão' },
  { value: 'price', label: 'Menor preço' },
  { value: 'rarity', label: 'Raridade' },
];

/** Quantos itens aparecem por vez (cada um desenha o Mochi, então mostrar todos de uma vez pesaria). */
const PAGE = 12;

const rarityIndex = (r: Rarity): number => RARITIES.indexOf(r);

/** Itens de compra primeiro (na loja ou de época), depois os de conquista, de baú e a recompensa semanal. */
const kindOrder = (item: Item): number => (item.source.kind === 'shop' ? 0 : item.source.kind === 'season' ? 1 : item.source.kind === 'achievement' ? 2 : item.source.kind === 'weekly' ? 3 : 4);

interface ShopViewProps {
  /** Mostra o item no Mochi grande, sem ser dele ainda. */
  onPreview: (preview: MochiOutfit | null) => void;
}

/** O cartão de um item: o Mochi vestido com ele, o nome, a raridade e o preço ou como conseguir. */
function ItemCard({ item, owned, selected, price, canBuy, short, onPress, index }: { item: Item; owned: boolean; selected: boolean; price: number | null; canBuy: boolean; short: boolean; onPress: () => void; index: number }) {
  const { colors } = useTheme();
  const style = rarityStyle(item.rarity, colors);
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 40).duration(220).reduceMotion(ReduceMotion.System)} style={styles.cell}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${RARITY_LABELS[item.rarity]}${owned ? ', seu' : canBuy && price !== null ? `, ${price} pétalas` : ', bloqueado'}`}
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: selected ? colors.ink : item.rarity === 'common' ? colors.line : style.fg,
            borderWidth: selected ? 3 : 2,
          },
        ]}
      >
        <View style={[styles.art, { backgroundColor: style.bg }]}>
          <MochiArt mood="happy" size={112} outfit={{ [item.slot]: item.id }} />
          {!owned && !canBuy ? (
            <View style={[styles.lock, { backgroundColor: colors.surface }]}>
              <AppText>🔒</AppText>
            </View>
          ) : null}
        </View>
        <AppText style={styles.name} numberOfLines={2}>
          {item.name}
        </AppText>
        <View style={styles.meta}>
          <AppText variant="caption" color="muted">
            {RARITY_LABELS[item.rarity]} {style.stars}
          </AppText>
          {owned ? (
            <AppText variant="caption" color="ok">
              ✓ Seu
            </AppText>
          ) : canBuy && price !== null ? (
            <AppText style={styles.price} color={short ? 'muted' : 'primary'}>
              🌸 {price}
            </AppText>
          ) : (
            <AppText variant="caption" color="muted">
              {item.source.kind === 'loot' ? 'Baú' : item.source.kind === 'season' ? 'Época' : 'Conquista'}
            </AppText>
          )}
        </View>
      </PressableScale>
    </Animated.View>
  );
}

/**
 * Loja do Mochi: categorias (cabeça, rosto, pescoço, fundos, cores, peles e a coleção rara), filtros e ordem, cartões com o
 * Mochi vestido com cada item, raridade e preço, e uma prévia grande antes de comprar. Os itens raros só saem nos baús e nas
 * conquistas: aqui aparecem trancados, para dar vontade de conseguir.
 */
export function ShopView({ onPreview }: ShopViewProps) {
  const { colors } = useTheme();
  const journey = useProgressStore((s) => s.journey);
  const buy = useProgressStore((s) => s.buyJourneyItem);
  const [category, setCategory] = useState<Category>('all');
  const [show, setShow] = useState<Show>('all');
  const [sort, setSort] = useState<Sort>('default');
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const scrollIntoView = useScrollIntoView();
  const previewRef = useRef<View>(null);
  const now = new Date();

  const items = useMemo(() => {
    let list = ITEMS.filter((item) => {
      if (category === 'seasons') return item.source.kind === 'season';
      if (category === 'collection') return item.source.kind !== 'shop' && item.source.kind !== 'season';
      return category === 'all' || item.slot === category;
    });
    const owned = new Set(journey.owned);
    if (show === 'mine') list = list.filter((i) => owned.has(i.id));
    if (show === 'can') list = list.filter((i) => !owned.has(i.id) && buyable(i, new Date()) && journey.petals >= (priceOf(i) ?? Infinity));
    const ordered = [...list];
    if (sort === 'price') ordered.sort((a, b) => (priceOf(a) ?? 99999) - (priceOf(b) ?? 99999));
    else if (sort === 'rarity') ordered.sort((a, b) => rarityIndex(b.rarity) - rarityIndex(a.rarity) || kindOrder(a) - kindOrder(b));
    else if (category === 'seasons') ordered.sort((a, b) => Number(buyable(b, new Date())) - Number(buyable(a, new Date())));
    else ordered.sort((a, b) => kindOrder(a) - kindOrder(b));
    return ordered;
  }, [category, show, sort, journey.owned, journey.petals]);

  const shown = items.slice(0, pages * PAGE);

  const select = (item: Item) => {
    setSelected(item.id);
    setMessage(null);
    setConfirming(false);
    setCelebrate(false);
    onPreview({ [item.slot]: item.id });
    // A prévia fica acima da lista: leva a tela até ela, para a pessoa ver o resultado.
    scrollIntoView(previewRef.current);
  };

  const purchase = (item: Item) => {
    const error = buy(item.id);
    if (error) {
      setMessage({ text: BUY_MESSAGES[error], ok: false });
      return;
    }
    setConfirming(false);
    setCelebrate(true);
    setMessage({ text: `${item.name} é seu! Ele já está no Mochi.`, ok: true });
    onPreview(null);
  };

  const chosen = ITEMS.find((i) => i.id === selected);
  const chosenOwned = chosen ? journey.owned.includes(chosen.id) : false;
  const chosenPrice = chosen ? priceOf(chosen) : null;
  const chosenStyle = chosen ? rarityStyle(chosen.rarity, colors) : null;

  return (
    <View style={styles.root}>
      <View style={[styles.balance, { backgroundColor: colors.primarySoft, borderColor: colors.line }]}>
        <AppText style={styles.balanceNumber}>🌸 {journey.petals}</AppText>
        <AppText variant="caption" color="muted" style={styles.flex}>
          pétalas. Elas vêm de lições, revisões e missões. Os itens raros saem nos baús do dia e da semana e nas conquistas.
        </AppText>
      </View>

      <ChipRow options={CATEGORIES} value={category} onChange={(v) => { setCategory(v); setPages(1); }} />
      <View style={styles.filters}>
        <ChipRow wrap options={SHOWS} value={show} onChange={(v) => { setShow(v); setPages(1); }} />
        <ChipRow wrap options={SORTS} value={sort} onChange={(v) => { setSort(v); setPages(1); }} />
      </View>

      <View ref={previewRef} collapsable={false}>
        {chosen && chosenStyle ? (
          <Card enterIndex={0} style={[styles.preview, { borderColor: chosenStyle.fg, borderWidth: 2 }]}>
            <AppText variant="caption" color="muted">
              PRÉVIA: COMO O MOCHI FICA
            </AppText>
            <Mascot mood={celebrate ? 'cheer' : 'happy'} size={170} outfit={{ ...outfitOf(journey, now), [chosen.slot]: chosen.id }} />
            <AppText variant="title" center>
              {chosen.name}
            </AppText>
            <View style={[styles.badge, { borderColor: chosenStyle.fg, backgroundColor: chosenStyle.bg }]}>
              <AppText>
                <Bold>
                  {RARITY_LABELS[chosen.rarity]} {chosenStyle.stars}
                </Bold>
              </AppText>
            </View>
            <AppText color="muted" center>
              {chosen.description}
            </AppText>
            {chosenOwned ? (
              <AppText color="ok">Você já tem este item. Vista-o em Armário.</AppText>
            ) : chosenPrice !== null && buyable(chosen, now) ? (
              confirming ? (
                <View style={styles.confirm}>
                  <AppText center>
                    Comprar <Bold>{chosen.name}</Bold> por 🌸 {chosenPrice}? Sobram 🌸 {journey.petals - chosenPrice}.
                  </AppText>
                  <Button label="Confirmar a compra" onPress={() => purchase(chosen)} />
                  <Button label="Voltar" variant="ghost" onPress={() => setConfirming(false)} />
                </View>
              ) : (
                <Button
                  label={journey.petals >= chosenPrice ? `Comprar por 🌸 ${chosenPrice}` : `Faltam 🌸 ${chosenPrice - journey.petals}`}
                  disabled={journey.petals < chosenPrice}
                  onPress={() => setConfirming(true)}
                />
              )
            ) : (
              <AppText color="muted" center>
                {howToGet(chosen)}
              </AppText>
            )}
            {message ? (
              <AppText color={message.ok ? 'ok' : 'bad'} accessibilityLiveRegion="polite">
                {message.text}
              </AppText>
            ) : null}
            {celebrate ? <PetalRain count={20} /> : null}
          </Card>
        ) : (
          <AppText variant="caption" color="muted">
            Toque num item para ver como o Mochi fica, antes de comprar.
          </AppText>
        )}
      </View>

      {items.length === 0 ? (
        <AppText color="muted">
          {show === 'can' ? 'Nada que você possa comprar agora nesta categoria. Junte mais pétalas!' : show === 'mine' ? 'Você ainda não tem itens aqui.' : 'Nada por aqui.'}
        </AppText>
      ) : (
        <>
          <AppText variant="caption" color="muted">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </AppText>
          <View style={styles.grid}>
            {shown.map((item, i) => {
              const owned = journey.owned.includes(item.id);
              const price = priceOf(item);
              const canBuy = price !== null && buyable(item, now);
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  owned={owned}
                  selected={selected === item.id}
                  price={price}
                  canBuy={canBuy}
                  short={canBuy && !owned && journey.petals < (price ?? 0)}
                  index={i}
                  onPress={() => select(item)}
                />
              );
            })}
          </View>
          {shown.length < items.length ? <Button label={`Mostrar mais (${items.length - shown.length})`} variant="soft" onPress={() => setPages((p) => p + 1)} /> : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  flex: { flex: 1 },
  balance: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1.5, borderRadius: radii.lg, padding: spacing.md },
  balanceNumber: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 32 },
  filters: { gap: spacing.xs },
  preview: { alignItems: 'center', gap: spacing.sm },
  badge: { borderWidth: 2, borderRadius: radii.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  confirm: { alignSelf: 'stretch', gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  cell: { width: '47.5%', flexGrow: 1 },
  card: { borderRadius: radii.lg, padding: spacing.sm, gap: spacing.xs, alignItems: 'stretch' },
  art: { borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xs, overflow: 'hidden' },
  lock: { position: 'absolute', top: 6, right: 6, borderRadius: radii.pill, paddingHorizontal: 6, paddingVertical: 2 },
  name: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
});
