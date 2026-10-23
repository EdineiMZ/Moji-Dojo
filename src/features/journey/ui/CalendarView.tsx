import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@/components';
import { formatDay } from '@/features/streak/days';
import { radii, spacing, useTheme } from '@/theme';
import { monthName } from '../summary';
import { monthGrid } from '../calendar';

interface CalendarViewProps {
  /** Dias estudados ("AAAA-MM-DD"). */
  days: readonly string[];
  /** Dias da semana (0 = domingo) de descanso. */
  rest: readonly number[];
  now: Date;
}

const HEADERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

/** Quantos meses para trás o calendário deixa olhar. */
const MAX_BACK = 12;

/** Calendário de estudo: um mês por vez, com os dias estudados marcados, os de descanso mais claros e hoje com contorno. */
export function CalendarView({ days, rest, now }: CalendarViewProps) {
  const { colors } = useTheme();
  const [back, setBack] = useState(0);
  const studied = new Set(days);
  const shown = new Date(now.getFullYear(), now.getMonth() - back, 1);
  const weeks = monthGrid(shown.getFullYear(), shown.getMonth());
  const today = formatDay(now);
  const count = weeks.flat().filter((d) => d !== null && studied.has(formatDay(new Date(shown.getFullYear(), shown.getMonth(), d as number)))).length;

  return (
    <Card enterIndex={0}>
      <View style={styles.nav}>
        <Button label="‹" variant="ghost" disabled={back >= MAX_BACK} onPress={() => setBack((b) => b + 1)} />
        <AppText variant="title" center>
          {monthName(now, back)} de {shown.getFullYear()}
        </AppText>
        <Button label="›" variant="ghost" disabled={back === 0} onPress={() => setBack((b) => Math.max(0, b - 1))} />
      </View>
      <View style={styles.row}>
        {HEADERS.map((h, i) => (
          <AppText key={i} variant="caption" color="muted" center style={styles.cell}>
            {h}
          </AppText>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.row}>
          {week.map((day, di) => {
            if (day === null) return <View key={di} style={styles.cell} />;
            const key = formatDay(new Date(shown.getFullYear(), shown.getMonth(), day));
            const on = studied.has(key);
            const isRest = rest.includes(di) && !on;
            return (
              <View
                key={di}
                accessibilityLabel={`${day}${on ? ', estudou' : ''}${key === today ? ', hoje' : ''}`}
                style={[
                  styles.cell,
                  styles.day,
                  {
                    backgroundColor: on ? colors.primary : isRest ? colors.lilacSoft : 'transparent',
                    borderColor: key === today ? colors.ink : 'transparent',
                  },
                ]}
              >
                <AppText variant="caption" color={on ? 'onPrimary' : key > today ? 'muted' : 'ink'}>
                  {day}
                </AppText>
              </View>
            );
          })}
        </View>
      ))}
      <AppText variant="caption" color="muted">
        {count} {count === 1 ? 'dia estudado' : 'dias estudados'} neste mês
        {rest.length > 0 ? ' · dias claros são de descanso' : ''}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row: { flexDirection: 'row', gap: 4 },
  cell: { flex: 1 },
  day: { aspectRatio: 1, borderRadius: radii.md, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginVertical: spacing.xs / 2 },
});
