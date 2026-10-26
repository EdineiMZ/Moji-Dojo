import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow } from '@/components';
import { feedbackCorrect } from '@/lib/feedback';
import { useProgressStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { howTo, simulatorProgress } from './flick';
import { FlickPad } from './FlickPad';
import {
  buildPracticePool,
  highestUnlocked,
  isUnlocked,
  itemsOfLevel,
  LEVELS,
  pickPractice,
  UNLOCK_AFTER,
  type ExtraPhrase,
  type PracticeItem,
} from './practice';
import { weakChars } from './typingStats';
import { useTypingTracker } from './useTypingTracker';

const SOURCE_LABEL: Readonly<Record<PracticeItem['source'], string>> = { word: '', phrase: '', mine: 'sua frase', ai: 'gerada por IA' };

interface TrainSessionProps {
  /** `level`: segue os níveis; `weak`: foca nas letras em que a pessoa mais erra. */
  mode: 'level' | 'weak';
  extras: readonly ExtraPhrase[];
}

/** Treino do teclado de flick: digite palavras e frases com a dica de qual tecla e direção usar. */
export function TrainSession({ mode, extras }: TrainSessionProps) {
  const { colors } = useTheme();
  const typing = useProgressStore((s) => s.typing);
  const [level, setLevel] = useState(() => highestUnlocked(typing));
  const [note, setNote] = useState('');
  const [hint, setHint] = useState(true);
  const [buffer, setBuffer] = useState('');
  const [cpm, setCpm] = useState<number | null>(null);

  const pool = useMemo(() => buildPracticePool(extras), [extras]);
  const weak = useMemo(() => new Set(weakChars(typing, 6)), [typing]);
  const source = useMemo(() => (mode === 'weak' ? pool : itemsOfLevel(pool, level)), [pool, mode, level]);
  const [item, setItem] = useState<PracticeItem | null>(() => pickPractice(source, Math.random, mode === 'weak' ? { weak } : {}));
  const tracker = useTypingTracker(mode === 'weak' ? 0 : level);

  const next = (from: readonly PracticeItem[] = source, previous?: string) => {
    tracker.begin();
    setItem(pickPractice(from, Math.random, mode === 'weak' ? { weak, ...(previous ? { avoid: previous } : {}) } : previous ? { avoid: previous } : {}));
    setBuffer('');
    setCpm(null);
  };

  const chooseLevel = (value: string) => {
    const id = Number(value);
    if (!isUnlocked(id, typing)) {
      setNote(`Faça ${UNLOCK_AFTER} itens do nível ${id - 1} para liberar este.`);
      return;
    }
    setNote('');
    setLevel(id);
    next(itemsOfLevel(pool, id));
  };

  const target = item?.text ?? '';
  const progress = simulatorProgress(buffer, target);
  const plan = progress.next ? howTo(progress.next) : null;
  const typed = [...buffer];
  const done = progress.done;

  const onType = (value: string) => {
    if (!item) return;
    const result = tracker.step(value, target);
    if (result.done && !done) {
      feedbackCorrect();
      setCpm(result.cpm);
    }
  };

  const status = done
    ? cpm ? `Isso! ${cpm} letras por minuto.` : 'Isso! Completo.'
    : progress.correct < typed.length
      ? 'Tem uma letra errada. Use ⌫ para apagar.'
      : hint && plan
        ? plan.text
        : '';

  const levelInfo = LEVELS.find((l) => l.id === level);
  const levelDone = typing.levelDone[String(level)] ?? 0;
  const options = LEVELS.map((l) => ({ value: String(l.id), label: `${isUnlocked(l.id, typing) ? '' : '🔒 '}${l.id}` }));

  return (
    <Card enterIndex={0}>
      {mode === 'level' ? (
        <>
          <ChipRow options={options} value={String(level)} onChange={chooseLevel} />
          <AppText variant="caption" color="muted">
            <Bold>{levelInfo?.title}</Bold>: {levelInfo?.description}
          </AppText>
          <AppText variant="caption" color="muted">
            {levelDone >= UNLOCK_AFTER ? 'Nível dominado.' : `${Math.min(levelDone, UNLOCK_AFTER)} de ${UNLOCK_AFTER} para liberar o próximo nível.`}
          </AppText>
          {note ? <AppText variant="caption" color="bad">{note}</AppText> : null}
        </>
      ) : weak.size > 0 ? (
        <AppText color="muted">
          Letras em que você mais erra: <Bold>{[...weak].join(' ')}</Bold>. Os itens abaixo usam essas letras.
        </AppText>
      ) : (
        <AppText color="muted">Você ainda não errou nenhuma letra. Treine nos níveis e volte aqui: este modo escolhe o que você mais precisa treinar.</AppText>
      )}

      {item ? (
        <>
          <View style={styles.counter}>
            <AppText variant="caption" color="muted">
              {SOURCE_LABEL[item.source] || ' '}
            </AppText>
            <Button label={hint ? '☑ mostrar dica' : '☐ mostrar dica'} variant="ghost" silent onPress={() => setHint((h) => !h)} />
          </View>

          <AppText variant="caption" color="muted">
            DIGITE
          </AppText>
          <AppText>
            <Bold>{item.text}</Bold> {item.meaning}
          </AppText>

          <View style={[styles.display, { backgroundColor: colors.background, borderColor: colors.line }]}>
            {typed.length === 0 ? (
              <AppText color="muted">Use o teclado abaixo</AppText>
            ) : (
              <AppText style={styles.typed}>
                <AppText style={styles.typed} color="ok">
                  {typed.slice(0, progress.correct).join('')}
                </AppText>
                <AppText style={styles.typed} color="bad">
                  {typed.slice(progress.correct).join('')}
                </AppText>
              </AppText>
            )}
          </View>

          <View accessibilityLiveRegion="polite" style={[styles.status, done && { backgroundColor: colors.okSoft }]}>
            <AppText variant="caption" color={done ? 'ok' : 'muted'}>
              {status || ' '}
            </AppText>
          </View>

          <FlickPad value={buffer} onChange={setBuffer} onType={onType} hintedKey={hint ? (plan?.key ?? null) : null} />

          {done ? <Button label="Próximo" onPress={() => next(source, item.text)} /> : <Button label="Pular" variant="ghost" onPress={() => next(source, item.text)} />}
        </>
      ) : (
        <AppText color="muted">Não há itens neste nível ainda.</AppText>
      )}
      <AppText variant="caption" color="muted">
        Segure a tecla e arraste para a direção da letra que quer.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  counter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  display: {
    minHeight: 64,
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  typed: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 34 },
  status: { minHeight: 24, borderRadius: radii.md, paddingHorizontal: spacing.sm, justifyContent: 'center' },
});
