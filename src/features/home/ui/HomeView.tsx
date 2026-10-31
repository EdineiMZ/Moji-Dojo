import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G } from 'react-native-svg';
import { AppText, Bold, Button, Card, ChipRow, Mascot, PetalRain, ProgressBar } from '@/components';
import { JpText } from '@/features/annotate/JpText';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { outfit as outfitOf } from '@/features/journey/journey';
import { useMochiMood } from '@/features/journey/useMochiMood';
import { FURNITURE_ART, ROOM_BACKGROUND, SCENE_HEIGHT, SCENE_WIDTH } from '../art';
import { findFurniture, findRoom, furnitureOf, HOME_BUY_MESSAGES, ROOMS, type Furniture, type Room } from '../home';
import { goalLabel, goalStatus, homeProgressOf } from '../goals';
import { findSkin, recolor, SKINNABLE, SKINS, skinKey, skinPriceFor } from '../skins';
import { houseWordOf, wordsOf } from '../words';
import { VisitView, WordChallenge } from './HouseWords';

const KIND_LABELS = { inside: 'Dentro de casa', outside: 'Do lado de fora' } as const;

/** O Mochi ocupa pouco mais de um terço da largura da cena. */
const MOCHI_SHARE = 0.38;

/** A cena de um cômodo: fundo, os móveis comprados e o Mochi no meio, na frente. */
function RoomScene({ room, furniture, locked }: { room: Room; furniture: readonly string[]; locked: boolean }) {
  const { colors } = useTheme();
  const journey = useProgressStore((s) => s.journey);
  const skinOf = journey.home.skin;
  const felt = useMochiMood();
  const [width, setWidth] = useState(0);
  const mochi = width * MOCHI_SHARE;
  // O fundo escolhido para o Mochi não entra aqui: o cômodo já é o cenário.
  const { back: _back, ...worn } = outfitOf(journey, new Date());

  return (
    <View
      accessible
      accessibilityLabel={locked ? `${room.name}, ainda trancado` : `${room.name}, com ${furniture.length} ${furniture.length === 1 ? 'móvel' : 'móveis'}`}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.scene, { borderColor: colors.line, aspectRatio: SCENE_WIDTH / SCENE_HEIGHT }]}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`} preserveAspectRatio="xMidYMid slice" opacity={locked ? 0.45 : 1}>
        {ROOM_BACKGROUND[room.id]}
        {furniture.map((id) => (
          <G key={id}>{recolor(FURNITURE_ART[id], findSkin(skinOf[id] ?? '')?.shift ?? 0)}</G>
        ))}
      </Svg>
      {locked ? (
        <View style={[styles.lock, { backgroundColor: colors.surface }]}>
          <AppText>🔒 Trancado</AppText>
        </View>
      ) : width > 0 ? (
        <View style={[styles.mochi, { width: mochi, left: (width - mochi) / 2 }]} pointerEvents="none">
          <Mascot mood={felt.mood} size={mochi} outfit={worn} />
        </View>
      ) : null}
    </View>
  );
}

/**
 * A Casa do Mochi: cômodos de dentro e de fora comprados com pétalas e, em cada um, móveis também comprados. O Mochi fica
 * dentro do cômodo que a pessoa está olhando.
 */
export function HomeView() {
  const { colors } = useTheme();
  const journey = useProgressStore((s) => s.journey);
  const buy = useProgressStore((s) => s.buyHomeThing);
  const buySkin = useProgressStore((s) => s.buyHomeSkin);
  const equipSkin = useProgressStore((s) => s.equipHomeSkin);
  const vocab = useProgressStore((s) => s.vocab);
  const mastered = useProgressStore((s) => s.mastered);
  const days = useProgressStore((s) => s.days);
  const learnWords = useProgressStore((s) => s.learnWords);
  const [roomId, setRoomId] = useState(ROOMS[0]?.id ?? 'quarto');
  const [confirming, setConfirming] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [celebrate, setCelebrate] = useState(0);
  const [challenge, setChallenge] = useState<{ kind: 'room' | 'furniture'; id: string; name: string } | null>(null);
  const [visiting, setVisiting] = useState(false);

  const room = findRoom(roomId) ?? ROOMS[0];
  if (!room) return null;
  const owned = journey.home.rooms.includes(room.id);
  const mine = journey.home.furniture.filter((id) => findFurniture(id)?.room === room.id);
  const pieces = furnitureOf(room.id);

  const purchase = (kind: 'room' | 'furniture', id: string, name: string) => {
    const error = buy(kind, id);
    setConfirming(null);
    if (error) {
      setMessage({ text: HOME_BUY_MESSAGES[error], ok: false });
      return;
    }
    const word = houseWordOf(id);
    if (word) learnWords([word.id]);
    const learned = word ? ` Palavra nova: ${word.jp}${word.reading !== word.jp ? ` (${word.reading})` : ''}, ${word.meaning}. Ela já está nas suas revisões.` : '';
    setMessage({ text: (kind === 'room' ? `${name} é seu! Agora é só mobiliar.` : `${name} já está no cômodo.`) + learned, ok: true });
    setCelebrate((n) => n + 1);
  };

  /** Comprar: se a peça tem palavra, primeiro a pessoa aprende a palavra; a compra só acontece depois de acertar. */
  const start = (kind: 'room' | 'furniture', id: string, name: string) => {
    if (houseWordOf(id)) {
      setConfirming(null);
      setChallenge({ kind, id, name });
      return;
    }
    purchase(kind, id, name);
  };
  const ownedWords = wordsOf([...journey.home.rooms, ...journey.home.furniture]);
  const goal = goalStatus(room.id, homeProgressOf({ vocab, mastered, days }));
  const wearSkin = (pieceId: string, skinId: string) => {
    if (skinId === '') {
      equipSkin(pieceId, null);
      return;
    }
    const owned = journey.home.skins.includes(skinKey(pieceId, skinId));
    if (owned) {
      equipSkin(pieceId, journey.home.skin[pieceId] === skinId ? null : skinId);
      return;
    }
    const error = buySkin(pieceId, skinId);
    setMessage(error ? { text: HOME_BUY_MESSAGES[error], ok: false } : { text: `Skin ${findSkin(skinId)?.name ?? ''} aplicada.`, ok: true });
    if (!error) setCelebrate((n) => n + 1);
  };

  const options = ROOMS.map((r) => ({ value: r.id, label: `${r.icon} ${r.name}${journey.home.rooms.includes(r.id) ? '' : ' 🔒'}` }));

  return (
    <View style={styles.root}>
      <View style={[styles.balance, { backgroundColor: colors.primarySoft, borderColor: colors.line }]}>
        <AppText style={styles.balanceNumber}>🌸 {journey.petals}</AppText>
        <AppText variant="caption" color="muted" style={styles.flex}>
          pétalas. Compre os cômodos da casa do Mochi e depois os móveis de cada um.
        </AppText>
      </View>

      <ChipRow
        wrap
        options={options}
        value={room.id}
        onChange={(v) => {
          setRoomId(v);
          setConfirming(null);
          setMessage(null);
        }}
      />

      <RoomScene room={room} furniture={mine} locked={!owned} />

      {visiting ? <VisitView owned={ownedWords} onExit={() => setVisiting(false)} /> : null}
      {challenge && houseWordOf(challenge.id) ? (
        <WordChallenge
          word={houseWordOf(challenge.id) as NonNullable<ReturnType<typeof houseWordOf>>}
          name={challenge.name}
          onCancel={() => setChallenge(null)}
          onDone={() => {
            const done = challenge;
            setChallenge(null);
            purchase(done.kind, done.id, done.name);
          }}
        />
      ) : null}

      {visiting || challenge ? null : (
        <>
        <View style={styles.titleRow}>
          <AppText variant="title">{room.name}</AppText>
          <AppText variant="caption" color="muted">
            {KIND_LABELS[room.kind]}
          </AppText>
        </View>
        <AppText color="muted">{room.description}</AppText>

        {message ? (
          <AppText color={message.ok ? 'ok' : 'bad'} accessibilityLiveRegion="polite">
            {message.text}
          </AppText>
        ) : null}

        {!owned ? (
          confirming === room.id ? (
            <Card enterIndex={0} style={styles.confirm}>
              <AppText center>
                Comprar <Bold>{room.name}</Bold> por 🌸 {room.price}? Sobram 🌸 {journey.petals - room.price}.
              </AppText>
              <Button label="Confirmar a compra" onPress={() => start('room', room.id, room.name)} />
              <Button label="Voltar" variant="ghost" onPress={() => setConfirming(null)} />
            </Card>
          ) : (
  <>
              {goal ? (
                <View style={[styles.goal, { borderColor: goal.met ? colors.ok : colors.line, backgroundColor: colors.surface }]}>
                  <AppText style={styles.name}>{goal.met ? '✓ Meta de estudo cumprida' : 'Meta de estudo para liberar'}</AppText>
                  <AppText variant="caption" color="muted">
                    {goalLabel(goal.goal)}: você tem {Math.min(goal.have, goal.goal.goal)} de {goal.goal.goal}.
                  </AppText>
                  <ProgressBar value={goal.have / goal.goal.goal} />
                </View>
              ) : null}
              <Button
                label={goal && !goal.met ? 'Cumpra a meta para comprar' : journey.petals >= room.price ? `Comprar o cômodo por 🌸 ${room.price}` : `Faltam 🌸 ${room.price - journey.petals}`}
                disabled={(goal !== null && !goal.met) || journey.petals < room.price}
                onPress={() => setConfirming(room.id)}
              />
            </>
          )
        ) : (
          <>
            <AppText variant="caption" color="muted">
              {mine.length} de {pieces.length} móveis
            </AppText>
            {pieces.map((piece) => (
              <FurnitureRow
                key={piece.id}
                piece={piece}
                has={mine.includes(piece.id)}
                petals={journey.petals}
                confirming={confirming === piece.id}
                onAsk={() => setConfirming(piece.id)}
                onCancel={() => setConfirming(null)}
                onBuy={() => start('furniture', piece.id, piece.name)}
                skins={{ owned: journey.home.skins, on: journey.home.skin[piece.id], onPick: (skinId) => wearSkin(piece.id, skinId) }}
              />
            ))}
            {ownedWords.length >= 3 ? (
              <Button label={`Visita guiada: as ${ownedWords.length} palavras da casa`} variant="soft" onPress={() => setVisiting(true)} />
            ) : (
              <AppText variant="caption" color="muted">
                Com 3 palavras da casa, o Mochi te leva numa visita guiada para revisar todas.
              </AppText>
            )}
          </>
        )}
        </>
      )}
      {celebrate > 0 ? <PetalRain key={celebrate} count={16} /> : null}
    </View>
  );
}

/** A palavra de uma peça que já está na casa, com como se lê e o significado. */
function HouseWordLine({ id }: { id: string }) {
  const word = houseWordOf(id);
  if (!word) return null;
  return (
    <JpText variant="caption">
      {`Palavra: ${word.jp}${word.reading !== word.jp ? ` (${word.reading})` : ''} · ${word.meaning}`}
    </JpText>
  );
}

interface SkinProps {
  /** Skins compradas ("móvel:skin"). */
  owned: readonly string[];
  /** A skin em uso neste móvel. */
  on: string | undefined;
  onPick: (skinId: string) => void;
}

/** As cores do móvel: o original (grátis) e cada skin, com o preço das que ainda não são suas. */
function SkinPicker({ piece, skins, petals }: { piece: Furniture; skins: SkinProps; petals: number }) {
  const price = skinPriceFor(piece.price);
  const options = [
    { value: '', label: 'Original' },
    ...SKINS.map((skin) => {
      const mine = skins.owned.includes(skinKey(piece.id, skin.id));
      return { value: skin.id, label: mine ? skin.name : petals >= price ? `${skin.name} 🌸 ${price}` : `${skin.name} 🔒 ${price}` };
    }),
  ];
  return (
    <View style={styles.skins}>
      <AppText variant="caption" color="muted">
        Cores do móvel
      </AppText>
      <ChipRow wrap options={options} value={skins.on ?? ''} onChange={(v) => skins.onPick(v)} />
    </View>
  );
}

function FurnitureRow({ piece, has, petals, confirming, onAsk, onCancel, onBuy, skins }: { piece: Furniture; has: boolean; petals: number; confirming: boolean; onAsk: () => void; onCancel: () => void; onBuy: () => void; skins?: SkinProps }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: has ? colors.ok : colors.line }]}>
      <View style={styles.flex}>
        <AppText style={styles.name}>{piece.name}</AppText>
        <AppText variant="caption" color="muted">
          {piece.description}
        </AppText>
        {has ? <HouseWordLine id={piece.id} /> : null}
        {has && skins && SKINNABLE.has(piece.id) ? <SkinPicker piece={piece} skins={skins} petals={petals} /> : null}
        {confirming ? (
          <AppText variant="caption">
            Comprar por 🌸 {piece.price}? Sobram 🌸 {petals - piece.price}.
          </AppText>
        ) : null}
      </View>
      {has ? (
        <AppText color="ok">✓ Na casa</AppText>
      ) : confirming ? (
        <View style={styles.actions}>
          <Button label="Comprar" onPress={onBuy} />
          <Button label="Voltar" variant="ghost" onPress={onCancel} />
        </View>
      ) : (
        <Button label={petals >= piece.price ? `🌸 ${piece.price}` : `Faltam ${piece.price - petals}`} variant="soft" disabled={petals < piece.price} onPress={onAsk} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  flex: { flex: 1 },
  balance: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1.5, borderRadius: radii.lg, padding: spacing.md },
  balanceNumber: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 32 },
  scene: { width: '100%', borderWidth: 2, borderRadius: radii.lg, overflow: 'hidden' },
  mochi: { position: 'absolute', bottom: 0 },
  lock: { position: 'absolute', alignSelf: 'center', top: '40%', borderRadius: radii.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: spacing.sm },
  confirm: { gap: spacing.sm },
  goal: { gap: spacing.xs, borderWidth: 1.5, borderRadius: radii.lg, padding: spacing.md },
  skins: { gap: spacing.xs, marginTop: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1.5, borderRadius: radii.lg, padding: spacing.md },
  name: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  actions: { gap: spacing.xs },
});
