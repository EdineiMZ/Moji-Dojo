import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@/components';
import { useProgressStore } from '@/store';
import { spacing } from '@/theme';

/** Zera lições, revisões, estatísticas e dias de estudo. Pede confirmação antes. */
export function ResetCard() {
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const [confirming, setConfirming] = useState(false);
  const [justReset, setJustReset] = useState(false);

  return (
    <Card enterIndex={2}>
      <AppText variant="title">Zerar progresso</AppText>
      {confirming ? (
        <>
          <AppText>Apagar todo o progresso salvo neste aparelho? Isso não pode ser desfeito.</AppText>
          <View style={styles.actions}>
            <Button
              label="Apagar tudo"
              onPress={() => {
                resetProgress();
                setConfirming(false);
                setJustReset(true);
              }}
            />
            <Button label="Cancelar" variant="ghost" onPress={() => setConfirming(false)} />
          </View>
        </>
      ) : (
        <>
          <AppText color="muted">
            {justReset
              ? 'Progresso zerado. Você pode começar de novo ou importar um backup.'
              : 'Apaga lições, revisões, estatísticas e dias seguidos deste aparelho.'}
          </AppText>
          <Button
            label="Zerar progresso"
            variant="ghost"
            onPress={() => {
              setJustReset(false);
              setConfirming(true);
            }}
          />
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({ actions: { gap: spacing.sm } });
