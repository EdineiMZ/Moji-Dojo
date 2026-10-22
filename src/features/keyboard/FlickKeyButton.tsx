import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { AppText } from '@/components';
import type { FlickKey } from '@/data/types';
import { fonts, radii, useTheme } from '@/theme';
import { charFor, MOD_KEY, resolveDirection, type FlickDirection } from './flick';

const CELL = 46;

/** Posição de cada direção na cruz 3x3 (0 = toque no centro, 1 esquerda, 2 cima, 3 direita, 4 baixo). */
const CROSS_CELL: Readonly<Record<FlickDirection, number>> = { 0: 4, 1: 3, 2: 1, 3: 5, 4: 7 };

interface FlickKeyButtonProps {
  keyData: FlickKey;
  /** Destaca a tecla que a dica manda usar. */
  hinted: boolean;
  size: number;
  /** Chamado ao soltar uma tecla comum, com a letra da direção. */
  onInput: (char: string) => void;
  /** Chamado ao tocar na tecla 小゛゜. */
  onMod: () => void;
}

/**
 * Tecla do teclado de flick: toque e solte para a primeira letra; segure e deslize para as outras.
 * Enquanto o dedo está na tecla, uma cruz mostra as opções e destaca a da direção atual.
 */
export function FlickKeyButton({ keyData, hinted, size, onInput, onMod }: FlickKeyButtonProps) {
  const { colors } = useTheme();
  const isMod = keyData.label === MOD_KEY;
  const [direction, setDirection] = useState<FlickDirection | null>(null);
  const current = useSharedValue(-1);

  const finish = (d: FlickDirection) => {
    setDirection(null);
    if (isMod) onMod();
    else onInput(charFor(keyData, d));
  };

  const pan = Gesture.Pan()
    .minDistance(0)
    .maxPointers(1)
    .onBegin(() => {
      current.value = 0;
      if (!isMod) scheduleOnRN(setDirection, 0);
    })
    .onUpdate((e) => {
      if (isMod) return;
      const d = resolveDirection(e.translationX, e.translationY);
      if (d !== current.value) {
        current.value = d;
        scheduleOnRN(setDirection, d);
      }
    })
    .onFinalize(() => {
      const d = (current.value < 0 ? 0 : current.value) as FlickDirection;
      current.value = -1;
      scheduleOnRN(finish, d);
    });

  const chars = [...keyData.chars];
  const cross = [null, chars[2], null, chars[1], chars[0], chars[3], null, chars[4], null];

  return (
    <View style={[styles.slot, { width: size, height: size }, direction !== null && styles.raised]}>
      <GestureDetector gesture={pan}>
        <View
          accessibilityRole="button"
          accessibilityLabel={isMod ? 'Tecla de tracinhos e letras pequenas' : `Tecla ${keyData.label}`}
          style={[
            styles.key,
            {
              backgroundColor: isMod ? colors.lilacSoft : colors.surface,
              borderColor: hinted ? colors.primary : colors.line,
              borderWidth: hinted ? 3 : 1.5,
            },
          ]}
        >
          <AppText style={{ fontFamily: fonts.bold, fontSize: isMod ? 16 : 22 }}>
            {isMod ? '小゛゜' : keyData.label === '、' ? '、。?!' : keyData.label}
          </AppText>
        </View>
      </GestureDetector>

      {direction !== null && !isMod ? (
        <View
          pointerEvents="none"
          style={[
            styles.popup,
            { backgroundColor: colors.surface, borderColor: colors.primary, left: (size - CELL * 3) / 2, top: (size - CELL * 3) / 2 },
          ]}
        >
          {cross.map((char, i) => {
            const selected = CROSS_CELL[direction] === i;
            return (
              <View key={i} style={[styles.cell, selected && { backgroundColor: colors.primary }]}>
                {char ? (
                  <AppText style={{ fontFamily: fonts.bold, fontSize: 22 }} color={selected ? 'onPrimary' : 'ink'}>
                    {char}
                  </AppText>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: { padding: 3 },
  /** A tecla pressionada (e a cruz dela) precisa ficar por cima das vizinhas. */
  raised: { zIndex: 20, elevation: 20 },
  key: { flex: 1, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  popup: {
    position: 'absolute',
    width: CELL * 3,
    height: CELL * 3,
    borderRadius: radii.lg,
    borderWidth: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  cell: { width: CELL, height: CELL, alignItems: 'center', justifyContent: 'center' },
});
