import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, Card, ChipRow } from '@/components';
import { useProgressStore, useSettingsStore } from '@/store';
import { dailyGoalFor } from '@/features/onboarding/onboarding';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { cleanUsername, GOAL_OPTIONS, USERNAME_MAX } from './profile';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;

/** O perfil nos Ajustes: nome, meta de minutos por dia e dia de folga, com o caminho para rever a introdução. */
export function ProfileCard() {
  const { colors } = useTheme();
  const router = useRouter();
  const profile = useSettingsStore((s) => s.profile);
  const setProfile = useSettingsStore((s) => s.setProfile);
  const rest = useProgressStore((s) => s.journey.restWeekdays);
  const updateJourney = useProgressStore((s) => s.updateJourney);
  const [name, setName] = useState(profile.username);

  const saveName = () => {
    const clean = cleanUsername(name);
    setName(clean);
    setProfile({ username: clean });
  };

  const restValue = rest.length === 0 ? 'none' : String(rest[0]);

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Você</AppText>
      <AppText variant="caption" color="muted">
        NOME
      </AppText>
      <TextInput
        value={name}
        onChangeText={setName}
        onBlur={saveName}
        onSubmitEditing={saveName}
        maxLength={USERNAME_MAX}
        autoCapitalize="words"
        autoCorrect={false}
        placeholder="como o Mochi te chama"
        placeholderTextColor={colors.muted}
        accessibilityLabel="Seu nome"
        returnKeyType="done"
        style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.line }]}
      />

      <AppText variant="caption" color="muted">
        META POR DIA
      </AppText>
      <ChipRow
        options={[{ value: '0', label: 'Sem meta' }, ...GOAL_OPTIONS.map((m) => ({ value: String(m), label: `${m} min` }))]}
        value={String(profile.goalMinutes)}
        onChange={(v) => {
          const minutes = Number(v);
          setProfile({ goalMinutes: minutes });
          if (minutes > 0) updateJourney((j) => ({ ...j, dailyGoal: dailyGoalFor(minutes) }));
        }}
      />

      <AppText variant="caption" color="muted">
        DIA DE FOLGA
      </AppText>
      <ChipRow
        options={[{ value: 'none', label: 'Nenhum' }, ...WEEKDAYS.map((d, i) => ({ value: String(i), label: d }))]}
        value={restValue}
        onChange={(v) => updateJourney((j) => ({ ...j, restWeekdays: v === 'none' ? [] : [Number(v)] }))}
      />
      <AppText variant="caption" color="muted">
        No dia de folga não há lembrete e a sua sequência não quebra.
      </AppText>

      <View style={styles.actions}>
        <Button label="Rever a introdução" variant="ghost" onPress={() => router.push('/welcome')} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1.5, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: fonts.regular, fontSize: fontSizes.title, minHeight: 52 },
  actions: { gap: spacing.sm },
});
