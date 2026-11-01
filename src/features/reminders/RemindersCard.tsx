import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, ChipRow, PressableScale } from '@/components';
import { useSettingsStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { exampleMessages, presetOf, PRESETS, TIME_CHOICES, timeChoiceOf, type ReminderPreset } from './presets';
import { permissionState, requestPermission, sendTest, type PermissionState } from './scheduler';
import { syncRemindersNow } from './useReminderSync';

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const;
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6h a 23h
const MINUTES = [0, 15, 30, 45];
const QUIET_FROM = [20, 21, 22, 23, 0];
const QUIET_TO = [5, 6, 7, 8, 9, 10];
const CUSTOM = 'custom';

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Ajustes dos lembretes, no mínimo: escolher um dos três jeitos (sem, leves, normais) e um horário pronto. O resto (hora exata,
 * dias, silêncio) fica atrás de "Personalizar". Tudo é feito no aparelho, sem internet e sem conta.
 */
export function RemindersCard() {
  const { colors } = useTheme();
  const reminders = useSettingsStore((s) => s.reminders);
  const setReminders = useSettingsStore((s) => s.setReminders);
  const profile = useSettingsStore((s) => s.profile);
  const [permission, setPermission] = useState<PermissionState>('undetermined');
  const [message, setMessage] = useState<string | null>(null);
  const [advanced, setAdvanced] = useState(false);

  useEffect(() => {
    void permissionState().then(setPermission);
  }, []);

  const preset = presetOf(reminders);
  const info = PRESETS.find((p) => p.value === preset);

  const choose = async (value: ReminderPreset) => {
    setMessage(null);
    const chosen = PRESETS.find((p) => p.value === value);
    if (!chosen) return;
    if (value === 'off') {
      setReminders({ ...chosen.patch, asked: true });
      return;
    }
    const granted = await requestPermission();
    setPermission(granted ? 'granted' : await permissionState());
    if (!granted) {
      setMessage('Sem permissão, o Android não deixa o app avisar. Libere as notificações do Moji Dojo nos ajustes do celular.');
      setReminders({ enabled: false, asked: true });
      return;
    }
    setReminders({ ...chosen.patch, asked: true });
  };

  const test = async () => {
    setMessage(null);
    try {
      if (!(await requestPermission())) {
        setMessage('Sem permissão para notificações.');
        return;
      }
      await sendTest();
      setMessage('Enviado! A notificação aparece em alguns segundos.');
    } catch {
      setMessage('Não foi possível enviar o teste agora.');
    }
  };

  const toggleDay = (index: number) => {
    const next = reminders.weekdays.includes(index) ? reminders.weekdays.filter((d) => d !== index) : [...reminders.weekdays, index].sort();
    setReminders({ weekdays: next });
  };

  const timeValue = timeChoiceOf(reminders.hour, reminders.minute) ?? CUSTOM;
  const examples = exampleMessages(preset, profile.username, profile.goalMinutes);

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Lembretes</AppText>
      <AppText color="muted">O Mochi avisa no celular para você treinar um pouco por dia. Tudo no aparelho, sem internet e sem conta.</AppText>

      <ChipRow wrap options={PRESETS.map((p) => ({ value: p.value, label: p.label }))} value={preset} onChange={(v) => void choose(v)} />
      {info ? (
        <AppText variant="caption" color="muted">
          {info.description}
        </AppText>
      ) : null}
      {permission === 'denied' ? (
        <AppText color="bad">As notificações estão bloqueadas para o app. Libere nos ajustes do celular (Apps → Moji Dojo → Notificações).</AppText>
      ) : null}

      {reminders.enabled ? (
        <>
          <AppText variant="caption" color="muted">
            QUE HORAS?
          </AppText>
          <ChipRow wrap
            options={[...TIME_CHOICES.map((t) => ({ value: t.label, label: t.label })), { value: CUSTOM, label: `Outro (${pad(reminders.hour)}:${pad(reminders.minute)})` }]}
            value={timeValue}
            onChange={(v) => {
              const t = TIME_CHOICES.find((x) => x.label === v);
              if (t) setReminders({ hour: t.hour, minute: t.minute });
              else setAdvanced(true);
            }}
          />
          {examples.length > 0 ? (
            <View style={[styles.examples, { backgroundColor: colors.background, borderColor: colors.field }]}>
              <AppText variant="caption" color="muted">
                ASSIM VÃO APARECER
              </AppText>
              {examples.map((line) => (
                <AppText key={line} variant="caption">
                  {line}
                </AppText>
              ))}
            </View>
          ) : null}
        </>
      ) : null}

      <View style={styles.actions}>
        <Button label="Enviar um lembrete de teste" variant="soft" onPress={() => void test()} />
        {reminders.enabled ? (
          <Button label={advanced ? 'Esconder opções' : 'Personalizar horário, dias e silêncio'} variant="ghost" onPress={() => setAdvanced((v) => !v)} />
        ) : null}
      </View>

      {reminders.enabled && advanced ? (
        <View style={styles.advanced}>
          <AppText variant="caption" color="muted">
            HORÁRIO EXATO: {pad(reminders.hour)}:{pad(reminders.minute)}
          </AppText>
          <ChipRow wrap options={HOURS.map((h) => ({ value: String(h), label: `${pad(h)}h` }))} value={String(reminders.hour)} onChange={(v) => setReminders({ hour: Number(v) })} />
          <ChipRow wrap options={MINUTES.map((m) => ({ value: String(m), label: `:${pad(m)}` }))} value={String(reminders.minute)} onChange={(v) => setReminders({ minute: Number(v) })} />

          <AppText variant="caption" color="muted">
            DIAS COM LEMBRETE
          </AppText>
          <View style={styles.row}>
            {WEEKDAYS.map((label, index) => {
              const on = reminders.weekdays.includes(index);
              return (
                <PressableScale
                  key={label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${label}: ${on ? 'com lembrete' : 'sem lembrete'}`}
                  onPress={() => toggleDay(index)}
                  style={[styles.day, { backgroundColor: on ? colors.primary : colors.surface, borderColor: on ? colors.primary : colors.line }]}
                >
                  <AppText style={{ fontFamily: fonts.bold }} color={on ? 'onPrimary' : 'ink'}>
                    {label}
                  </AppText>
                </PressableScale>
              );
            })}
          </View>
          <AppText variant="caption" color="muted">
            O dia de folga que você escolheu no perfil também fica sem lembrete.
          </AppText>

          <AppText variant="caption" color="muted">
            SILÊNCIO: DAS {pad(reminders.quietFrom)}H ÀS {pad(reminders.quietTo)}H
          </AppText>
          <ChipRow wrap options={QUIET_FROM.map((h) => ({ value: String(h), label: `desde ${pad(h)}h` }))} value={String(reminders.quietFrom)} onChange={(v) => setReminders({ quietFrom: Number(v) })} />
          <ChipRow wrap options={QUIET_TO.map((h) => ({ value: String(h), label: `até ${pad(h)}h` }))} value={String(reminders.quietTo)} onChange={(v) => setReminders({ quietTo: Number(v) })} />

          <Button
            label="Refazer o agendamento"
            variant="ghost"
            onPress={() =>
              void syncRemindersNow()
                .then((n) => setMessage(`${n} lembretes agendados.`))
                .catch(() => setMessage('Não foi possível agendar agora.'))
            }
          />
        </View>
      ) : null}

      {message ? (
        <AppText color="muted" accessibilityLiveRegion="polite">
          {message}
        </AppText>
      ) : null}
      <AppText variant="caption" color="muted">
        Quem passa dias sem abrir o app recebe menos avisos, e nunca mensagens de cobrança. Se os lembretes não chegarem, alguns celulares
        (Xiaomi, Samsung, Huawei) cortam alarmes em segundo plano: tire o Moji Dojo da economia de bateria.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs },
  day: { flex: 1, minHeight: 48, borderRadius: radii.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  actions: { gap: spacing.sm },
  advanced: { gap: spacing.md },
  examples: { borderRadius: radii.md, borderWidth: 1.5, padding: spacing.md, gap: spacing.xs },
});
