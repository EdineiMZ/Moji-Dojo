import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow, Mascot, ProgressBar } from '@/components';
import { GOAL_OPTIONS, USERNAME_MAX } from '@/features/profile/profile';
import { exampleMessages, PRESETS, TIME_CHOICES, type ReminderPreset } from '@/features/reminders/presets';
import { requestPermission } from '@/features/reminders/scheduler';
import { useProgressStore, useSettingsStore } from '@/store';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { applyAnswers, canAdvance, DEFAULT_ANSWERS, FEATURES, skipProfile, STEPS, type Answers, type StepId } from './onboarding';

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const;

const TITLES: Readonly<Record<StepId, string>> = {
  name: 'Bem-vindo ao Moji Dojo!',
  tour: 'O que tem aqui dentro',
  goal: 'Quanto tempo por dia?',
  rest: 'Um dia de folga?',
  reminders: 'Lembretes do Mochi',
  done: 'Tudo pronto',
};

/** A introdução do app: nome, apresentação das funções, meta diária, dia de folga e lembretes. Pode ser pulada. */
export function OnboardingView({ onFinish }: { onFinish: () => void }) {
  const { colors } = useTheme();
  const setProfile = useSettingsStore((s) => s.setProfile);
  const setReminders = useSettingsStore((s) => s.setReminders);
  const profile = useSettingsStore((s) => s.profile);
  const updateJourney = useProgressStore((s) => s.updateJourney);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ ...DEFAULT_ANSWERS, username: profile.username, goalMinutes: profile.goalMinutes || DEFAULT_ANSWERS.goalMinutes });
  const [notice, setNotice] = useState<string | null>(null);
  const id = STEPS[step] ?? 'done';
  const patch = (change: Partial<Answers>) => setAnswers((a) => ({ ...a, ...change }));

  const finish = () => {
    const applied = applyAnswers(answers);
    setProfile(applied.profile);
    setReminders(applied.reminders);
    updateJourney((j) => ({ ...j, restWeekdays: applied.restWeekdays, dailyGoal: applied.dailyGoal }));
    onFinish();
  };

  const skip = () => {
    setProfile(skipProfile(profile));
    onFinish();
  };

  const chooseReminder = async (value: ReminderPreset) => {
    setNotice(null);
    if (value === 'off') {
      patch({ reminder: 'off' });
      return;
    }
    const granted = await requestPermission().catch(() => false);
    if (!granted) {
      patch({ reminder: 'off' });
      setNotice('Sem permissão, o Android não deixa o app avisar. Você pode liberar depois, em Ajustes → Lembretes.');
      return;
    }
    patch({ reminder: value });
  };

  const back = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <ProgressBar value={step / (STEPS.length - 1)} />
          <AppText variant="caption" color="muted">
            Passo {step + 1} de {STEPS.length}
          </AppText>
        </View>
        <Mascot mood={id === 'done' ? 'cheer' : 'happy'} size={72} />
      </View>

      <AppText variant="headline">{TITLES[id]}</AppText>

      {id === 'name' ? (
        <Card enterIndex={0}>
          <AppText>
            Eu sou o <Bold>Mochi</Bold> e vou te acompanhar no japonês. Como posso te chamar?
          </AppText>
          <TextInput
            value={answers.username}
            onChangeText={(t) => patch({ username: t })}
            maxLength={USERNAME_MAX}
            autoCapitalize="words"
            autoCorrect={false}
            placeholder="seu nome ou apelido"
            placeholderTextColor={colors.muted}
            accessibilityLabel="Seu nome"
            returnKeyType="done"
            onSubmitEditing={() => canAdvance(id, answers) && next()}
            style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.field }]}
          />
          <AppText variant="caption" color="muted">
            O nome fica só no seu aparelho. O Mochi usa nas mensagens e nos lembretes.
          </AppText>
        </Card>
      ) : null}

      {id === 'tour' ? (
        <View style={styles.list}>
          {FEATURES.map((f, i) => (
            <Card key={f.title} enterIndex={Math.min(i, 5)}>
              <View style={styles.feature}>
                <View style={[styles.glyph, { backgroundColor: colors.primarySoft }]}>
                  <AppText variant="title">{f.glyph}</AppText>
                </View>
                <View style={styles.flex}>
                  <AppText style={{ fontFamily: fonts.bold }}>{f.title}</AppText>
                  <AppText variant="caption" color="muted">
                    {f.text}
                  </AppText>
                </View>
              </View>
            </Card>
          ))}
          <AppText variant="caption" color="muted">
            Tudo funciona sem internet e fica só no seu aparelho.
          </AppText>
        </View>
      ) : null}

      {id === 'goal' ? (
        <Card enterIndex={0}>
          <AppText>Quantos minutos por dia você quer treinar? É só uma meta, e dá para mudar quando quiser.</AppText>
          <ChipRow
            options={GOAL_OPTIONS.map((m) => ({ value: String(m), label: `${m} min` }))}
            value={String(answers.goalMinutes)}
            onChange={(v) => patch({ goalMinutes: Number(v) })}
          />
          <AppText variant="caption" color="muted">
            O app conta o tempo em que você está usando de verdade. Quinze minutinhos por dia rendem mais que duas horas no domingo.
          </AppText>
        </Card>
      ) : null}

      {id === 'rest' ? (
        <Card enterIndex={0}>
          <AppText>Quer um dia da semana de folga? Nele o Mochi não manda lembrete e a sua sequência não quebra.</AppText>
          <ChipRow
            options={[{ value: 'none', label: 'Sem folga' }, ...WEEKDAYS.map((d, i) => ({ value: String(i), label: d }))]}
            value={answers.restDay === null ? 'none' : String(answers.restDay)}
            onChange={(v) => patch({ restDay: v === 'none' ? null : Number(v) })}
          />
        </Card>
      ) : null}

      {id === 'reminders' ? (
        <Card enterIndex={0}>
          <AppText>O Mochi pode avisar no celular quando for hora de treinar. Como você prefere?</AppText>
          <ChipRow options={PRESETS.map((p) => ({ value: p.value, label: p.label }))} value={answers.reminder} onChange={(v) => void chooseReminder(v)} />
          <AppText variant="caption" color="muted">
            {PRESETS.find((p) => p.value === answers.reminder)?.description}
          </AppText>
          {answers.reminder !== 'off' ? (
            <>
              <AppText variant="caption" color="muted">
                QUE HORAS?
              </AppText>
              <ChipRow
                options={TIME_CHOICES.map((t, i) => ({ value: String(i), label: t.label }))}
                value={String(answers.timeIndex)}
                onChange={(v) => patch({ timeIndex: Number(v) })}
              />
              <View style={[styles.examples, { backgroundColor: colors.background, borderColor: colors.field }]}>
                <AppText variant="caption" color="muted">
                  ASSIM VÃO APARECER
                </AppText>
                {exampleMessages(answers.reminder, answers.username.trim(), answers.goalMinutes).map((line) => (
                  <AppText key={line} variant="caption">
                    {line}
                  </AppText>
                ))}
              </View>
            </>
          ) : null}
          {notice ? (
            <AppText color="muted" accessibilityLiveRegion="polite">
              {notice}
            </AppText>
          ) : null}
        </Card>
      ) : null}

      {id === 'done' ? (
        <Card enterIndex={0}>
          <AppText>
            {answers.username.trim() ? `Pronto, ${answers.username.trim()}!` : 'Pronto!'} Resumo das suas escolhas:
          </AppText>
          <AppText>• Meta: <Bold>{answers.goalMinutes} minutos</Bold> por dia</AppText>
          <AppText>• Folga: <Bold>{answers.restDay === null ? 'nenhuma' : WEEKDAYS[answers.restDay]}</Bold></AppText>
          <AppText>
            • Lembretes: <Bold>{PRESETS.find((p) => p.value === answers.reminder)?.label}</Bold>
            {answers.reminder === 'off' ? '' : ` às ${TIME_CHOICES[answers.timeIndex]?.label}`}
          </AppText>
          <AppText variant="caption" color="muted">
            Tudo isso pode ser mudado depois, em Ajustes.
          </AppText>
        </Card>
      ) : null}

      <View style={styles.actions}>
        {id === 'done' ? (
          <Button label="Começar!" onPress={finish} />
        ) : (
          <Button label={id === 'tour' ? 'Entendi, vamos!' : 'Continuar'} disabled={!canAdvance(id, answers)} onPress={next} />
        )}
        <View style={styles.secondary}>
          {step > 0 ? <Button label="Voltar" variant="ghost" onPress={back} style={styles.flex} /> : null}
          {id !== 'done' ? <Button label="Pular a introdução" variant="ghost" onPress={skip} style={styles.flex} /> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  list: { gap: spacing.md },
  feature: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  glyph: { width: 52, height: 52, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  input: { borderWidth: 1.5, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: fonts.regular, fontSize: fontSizes.title, minHeight: 52 },
  examples: { borderRadius: radii.md, borderWidth: 1.5, padding: spacing.md, gap: spacing.xs },
  actions: { gap: spacing.sm },
  secondary: { flexDirection: 'row', gap: spacing.sm },
});
