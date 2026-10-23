import { StyleSheet, View } from 'react-native';
import { AppText, Card, ChipRow } from '@/components';
import { useProgressStore } from '@/store';
import { spacing, useTheme } from '@/theme';
import { findItem, ITEMS, RARITY_LABELS, SLOT_LABELS, SLOTS } from '../items';
import { rarityStyle } from './rarity';

/** Armário: para cada espaço, escolhe o que o Mochi veste entre os itens que o aluno tem. */
export function WardrobeView() {
  const { colors } = useTheme();
  const journey = useProgressStore((s) => s.journey);
  const equip = useProgressStore((s) => s.equipJourneyItem);
  const unequip = useProgressStore((s) => s.unequipJourneySlot);
  const updateJourney = useProgressStore((s) => s.updateJourney);

  return (
    <View style={styles.root}>
      {SLOTS.map((slot, i) => {
        const owned = journey.owned.flatMap((id) => {
          const item = findItem(id);
          return item && item.slot === slot ? [item] : [];
        });
        const worn = journey.equipped[slot];
        return (
          <Card key={slot} enterIndex={Math.min(i + 1, 6)}>
            <AppText variant="title">
              {SLOT_LABELS[slot]} <AppText color="muted">{owned.length} de {ITEMS.filter((i) => i.slot === slot).length}</AppText>
            </AppText>
            {owned.length === 0 ? (
              <AppText color="muted">Você ainda não tem itens aqui. Veja a loja e as conquistas.</AppText>
            ) : (
              <ChipRow
                options={[{ value: 'none', label: 'Nenhum' }, ...owned.map((item) => ({ value: item.id, label: `${item.name} ${rarityStyle(item.rarity, colors).stars}`.trim() }))]}
                value={worn ?? 'none'}
                onChange={(id) => (id === 'none' ? unequip(slot) : equip(id))}
              />
            )}
            {worn ? (
              <AppText variant="caption" color="muted">
                {RARITY_LABELS[findItem(worn)?.rarity ?? 'common']} · {findItem(worn)?.description}
              </AppText>
            ) : null}
          </Card>
        );
      })}

      <Card enterIndex={6}>
        <AppText variant="title">Roupa de época</AppText>
        <AppText color="muted">
          Se você tem um item de temporada (gorro de fim de ano, flor de sakura...), o Mochi o veste sozinho enquanto a época dura,
          quando o espaço está livre.
        </AppText>
        <ChipRow
          options={[
            { value: 'on', label: 'Ligada' },
            { value: 'off', label: 'Desligada' },
          ]}
          value={journey.seasonalAuto ? 'on' : 'off'}
          onChange={(v) => updateJourney((j) => ({ ...j, seasonalAuto: v === 'on' }))}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({ root: { gap: spacing.md } });
