import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface CollapsibleProps {
  title: string;
  /** Uma linha sobre o que há lá dentro, sempre visível. */
  hint?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/** Seção que abre e fecha: deixa as telas de ajustes curtas, com o que é raro escondido atrás de um toque. */
export function Collapsible({ title, hint, defaultOpen = false, children }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.root}>
      <PressableScale
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${title}. ${open ? 'Aberto' : 'Fechado'}`}
        onPress={() => setOpen((v) => !v)}
        style={styles.header}
      >
        <View style={styles.titles}>
          <AppText variant="title">{title}</AppText>
          {hint ? (
            <AppText variant="caption" color="muted">
              {hint}
            </AppText>
          ) : null}
        </View>
        <AppText variant="title" color="muted">
          {open ? '▾' : '▸'}
        </AppText>
      </PressableScale>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, paddingVertical: spacing.sm },
  titles: { flex: 1, gap: 2 },
  body: { gap: spacing.lg },
});
