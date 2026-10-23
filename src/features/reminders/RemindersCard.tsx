import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, ChipRow, PressableScale } from '@/components';
import { useSettingsStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { syncRemindersNow } from './useReminderSync';
import { permissionState, requestPermission, sendTest, type PermissionState } from './scheduler';

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const;
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6h a 23h
const MINUTES = [0, 15, 30, 45];
const QUIET_FROM = [20, 21, 22, 23, 0];
const QUIET_TO = [5, 6, 7, 8, 9, 10];

const pad = (n: number): string => String(n).padStart(2, '0');

/** Ajustes dos lembretes de estudo: liga e desliga, horário, dias, aviso da noite e horário de silêncio. */
export function RemindersCard() {
  const { colors } = useTheme();
  const reminders = useSettingsStore((s) => s.reminders);
  const setReminders = useSettingsStore((s) => s.setReminders);
  const [permission, setPermission] = useState<PermissionState>('undetermined');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void permissionState().then(setPermission);
  }, []);

  const toggle = async (on: boolean) => {
    setMessage(null);
    if (!on) {
      setReminders({ enabled: false, asked: true });
      return;
    }
    const granted = await requestPermission();
    setPermission(granted ? 'granted' : await permissionState());
    if (!granted) {
      setMessage('Sem permissão, o Android não deixa o app avisar. Libere as notificações do Moji Dojo nos ajustes do celular.');
      setReminders({ enabled: false, asked: true });
      return;
    }
    setReminders({ enabled: true, asked: true });
  };

  const test = async () => {
    setMessage(null);
    try {
      const granted = await requestPermission();
      if (!granted) {
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

  return (
    <Card enterIndex={0}>
      <AppText variant="title">Lembretes</AppText>
      <AppText color="muted">
        O Mochi avisa no celular para você estudar um pouco por dia. Tudo é feito no aparelho, sem internet e sem conta.
      </AppText>
      <ChipRow
        options={[
          { value: 'on', label: 'Ligados' },
          { value: 'off', label: 'Desligados' },
        ]}
        value={reminders.enabled ? 'on' : 'off'}
        onChange={(v) => void toggle(v === 'on')}
      />
      {permission === 'denied' ? (
        <AppText color="bad">As notificações estão bloqueadas para o app. Libere nos ajustes do celular (Apps → Moji Dojo → Notificações).</AppText>
      ) : null}

      {reminders.enabled ? (
        <>
          <AppText variant="caption" color="muted">
            HORÁRIO: {pad(reminders.hour)}:{pad(reminders.minute)}
          </AppText>
          <ChipRow options={HOURS.map((h) => ({ value: String(h), label: `${pad(h)}h` }))} value={String(reminders.hour)} onChange={(v) => setReminders({ hour: Number(v) })} />
          <ChipRow options={MINUTES.map((m) => ({ value: String(m), label: `:${pad(m)}` }))} value={String(reminders.minute)} onChange={(v) => setReminders({ minute: Number(v) })} />

          <AppText variant="caption" color="muted">
            DIAS
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
            AVISO DA NOITE (SEQUÊNCIA EM RISCO)
          </AppText>
          <ChipRow
            options={[
              { value: 'on', label: 'Ligado' },
              { value: 'off', label: 'Desligado' },
            ]}
            value={reminders.risk ? 'on' : 'off'}
            onChange={(v) => setReminders({ risk: v === 'on' })}
          />
          <AppText variant="caption" color="muted">
            Só aparece se você tem uma sequência de 3 dias ou mais e ainda não estudou. Vem pelo menos 2 horas depois do
            lembrete diário.
          </AppText>

          <AppText variant="caption" color="muted">
            SILÊNCIO: DAS {pad(reminders.quietFrom)}H ÀS {pad(reminders.quietTo)}H
          </AppText>
          <ChipRow options={QUIET_FROM.map((h) => ({ value: String(h), label: `desde ${pad(h)}h` }))} value={String(reminders.quietFrom)} onChange={(v) => setReminders({ quietFrom: Number(v) })} />
          <ChipRow options={QUIET_TO.map((h) => ({ value: String(h), label: `até ${pad(h)}h` }))} value={String(reminders.quietTo)} onChange={(v) => setReminders({ quietTo: Number(v) })} />
        </>
      ) : null}

      <View style={styles.actions}>
        <Button
          label="Enviar um lembrete de teste"
          variant="soft"
          onPress={() => void test()}
        />
        {reminders.enabled ? <Button label="Refazer o agendamento" variant="ghost" onPress={() => void syncRemindersNow().then((n) => setMessage(`${n} lembretes agendados.`)).catch(() => setMessage('Não foi possível agendar agora.'))} /> : null}
      </View>
      {message ? (
        <AppText color="muted" accessibilityLiveRegion="polite">
          {message}
        </AppText>
      ) : null}
      <AppText variant="caption" color="muted">
        Quem passa dias sem abrir o app recebe menos avisos, e nunca mensagens de cobrança. Se os lembretes não chegarem, alguns
        celulares (Xiaomi, Samsung, Huawei) cortam alarmes em segundo plano: tire o Moji Dojo da economia de bateria.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs },
  day: { flex: 1, minHeight: 48, borderRadius: radii.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  actions: { gap: spacing.sm },
});
