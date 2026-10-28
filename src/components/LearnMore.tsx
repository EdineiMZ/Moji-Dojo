import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

/** Uma linha à vista e o resto atrás de "Saiba mais": tira o parágrafo longo de dentro dos cartões. */
export function LearnMore({ children, label = 'Saiba mais' }: { children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.root}>
      <PressableScale accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen((v) => !v)} hitSlop={8} style={styles.toggle}>
        <AppText variant="caption" color="primary">
          {open ? 'Mostrar menos ▴' : `${label} ▾`}
        </AppText>
      </PressableScale>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
  toggle: { alignSelf: 'flex-start', minHeight: 48, justifyContent: 'center' },
  body: { gap: spacing.xs },
});
