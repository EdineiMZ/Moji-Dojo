import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow, PressableScale } from '@/components';
import { KANA_MNEMONICS } from '@/data/hints';
import { KANA_EXAMPLES } from '@/data/examples';
import { getItem } from '@/features/catalog';
import { OptionButton, type OptionState } from '@/features/quiz/OptionButton';
import { buildOptions } from '@/features/quiz/quiz';
import { speakJapanese } from '@/features/speech/voiceStore';
import { SPEECH_RATES } from '@/store/settingsStore';
import { useSettingsStore } from '@/store';
import { fonts, radii, spacing, useTheme } from '@/theme';
import { chartChars, chartRows, type ChartSet, type Script } from './chart';
import { LOOKALIKES } from './lookalikes';

type Tab = 'table' | 'free' | 'similar';

const TABS = [
  { value: 'table' as const, label: 'Tabela' },
  { value: 'free' as const, label: 'Treino livre' },
  { value: 'similar' as const, label: 'Parecidos' },
];
const SCRIPTS = [
  { value: 'hira' as const, label: 'Hiragana' },
  { value: 'kata' as const, label: 'Katakana' },
];
const SETS = [
  { value: 'base' as const, label: 'Básicos' },
  { value: 'daku' as const, label: 'Com ten-ten e maru' },
];

/** Tabela dos kana, treino livre (sem mexer na revisão) e os pares que mais se confundem. */
export function ChartView() {
  const [tab, setTab] = useState<Tab>('table');
  const [script, setScript] = useState<Script>('hira');
  // Letras escolhidas para o treino livre a partir dos "parecidos"; null = o conjunto inteiro.
  const [custom, setCustom] = useState<readonly string[] | null>(null);

  return (
    <View style={styles.root}>
      <ChipRow options={TABS} value={tab} onChange={setTab} />
      <ChipRow options={SCRIPTS} value={script} onChange={setScript} />
      {tab === 'table' ? <Table script={script} /> : null}
      {tab === 'free' ? <FreePractice key={`${script}:${custom?.join('') ?? ''}`} script={script} custom={custom} onClearCustom={() => setCustom(null)} /> : null}
      {tab === 'similar' ? (
        <Similar
          script={script}
          onPractice={(chars) => {
            setCustom(chars);
            setTab('free');
          }}
        />
      ) : null}
    </View>
  );
}

function Table({ script }: { script: Script }) {
  const { colors } = useTheme();
  const speed = useSettingsStore((s) => s.speechSpeed);
  const [set, setSet] = useState<ChartSet>('base');
  const [picked, setPicked] = useState<string | null>(null);
  const rows = useMemo(() => chartRows(script, set), [script, set]);
  const item = picked ? getItem(picked) : null;
  const example = picked ? KANA_EXAMPLES[picked] : undefined;

  return (
    <Card enterIndex={0}>
      <ChipRow options={SETS} value={set} onChange={(v) => { setSet(v); setPicked(null); }} />
      <View accessibilityLabel={`Tabela de ${script === 'hira' ? 'hiragana' : 'katakana'}`} style={styles.grid}>
        {rows.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((cell, c) =>
              cell ? (
                <PressableScale
                  key={cell.char}
                  accessibilityRole="button"
                  accessibilityLabel={`${cell.char}, ${cell.romaji}`}
                  onPress={() => {
                    setPicked(cell.char);
                    speakJapanese(cell.char, SPEECH_RATES[speed]);
                  }}
                  style={[styles.cell, { backgroundColor: picked === cell.char ? colors.primarySoft : colors.lilacSoft, borderColor: picked === cell.char ? colors.primary : colors.line }]}
                >
                  <AppText style={styles.glyph}>{cell.char}</AppText>
                  <AppText variant="caption" color="muted">
                    {cell.romaji}
                  </AppText>
                </PressableScale>
              ) : (
                <View key={`v${c}`} style={styles.cell} />
              ),
            )}
          </View>
        ))}
      </View>
      {item && picked ? (
        <View style={[styles.detail, { backgroundColor: colors.lilacSoft }]}>
          <AppText variant="title">
            {picked} = {item.label}
          </AppText>
          {example ? (
            <AppText>
              Exemplo: <Bold>{example.word}</Bold> ({example.romaji}), {example.meaning}.
            </AppText>
          ) : null}
          <AppText color="muted">{KANA_MNEMONICS[picked] ?? 'Sem dica de memória para esta letra.'}</AppText>
          <Button label="🔊 Ouvir de novo" variant="soft" onPress={() => speakJapanese(picked, SPEECH_RATES[speed])} />
        </View>
      ) : (
        <AppText variant="caption" color="muted">
          Toque numa letra para ouvir, ver o exemplo e a dica de memória.
        </AppText>
      )}
    </Card>
  );
}

/** Uma pergunta: uma letra do conjunto e quatro opções de som. */
function makeQuestion(pool: readonly ReturnType<typeof getItem>[]) {
  const item = pool[Math.floor(Math.random() * pool.length)];
  return item ? { item, options: buildOptions(item, pool) } : null;
}

function FreePractice({ script, custom, onClearCustom }: { script: Script; custom: readonly string[] | null; onClearCustom: () => void }) {
  const [set, setSet] = useState<ChartSet>('base');
  const poolOf = (which: ChartSet) => (custom ?? chartChars(script, which)).map(getItem);
  const pool = poolOf(set);
  const [question, setQuestion] = useState(() => makeQuestion(pool));
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  if (!question) return <Card enterIndex={0}><AppText color="muted">Não há letras neste conjunto.</AppText></Card>;
  const answered = picked !== null;
  const stateOf = (char: string): OptionState => (!answered ? 'idle' : char === question.item.char ? 'right' : char === picked ? 'wrong' : 'dim');

  const answer = (char: string) => {
    if (answered) return;
    setPicked(char);
    setScore((s) => ({ right: s.right + (char === question.item.char ? 1 : 0), total: s.total + 1 }));
  };
  const next = () => {
    setPicked(null);
    setQuestion(makeQuestion(pool));
  };

  return (
    <Card enterIndex={0}>
      {custom ? (
        <>
          <AppText color="muted">Treinando só: {custom.join(' ')}</AppText>
          <Button label="Voltar a todas as letras" variant="ghost" onPress={onClearCustom} />
        </>
      ) : (
        <ChipRow options={SETS} value={set} onChange={(v) => { setSet(v); setPicked(null); setScore({ right: 0, total: 0 }); setQuestion(makeQuestion(poolOf(v))); }} />
      )}
      <AppText variant="caption" color="muted">
        QUAL É O SOM? · {score.right} de {score.total} certas. O treino livre não mexe nas suas revisões.
      </AppText>
      <AppText style={styles.big} accessibilityLabel={`Letra ${question.item.char}`}>
        {question.item.char}
      </AppText>
      <View style={styles.options}>
        {question.options.map((o, i) => (
          <OptionButton key={o.char} index={i} label={o.label} glyph={false} state={stateOf(o.char)} onPress={() => answer(o.char)} />
        ))}
      </View>
      {answered ? (
        <>
          <AppText accessibilityLiveRegion="polite" color={picked === question.item.char ? 'ok' : 'bad'}>
            <Bold>{picked === question.item.char ? 'Certo!' : `Era ${question.item.label}.`}</Bold>
          </AppText>
          <Button label="Próxima" onPress={next} />
        </>
      ) : null}
    </Card>
  );
}

function Similar({ script, onPractice }: { script: Script; onPractice: (chars: readonly string[]) => void }) {
  const { colors } = useTheme();
  const list = LOOKALIKES.filter((l) => l.script === script);
  return (
    <View style={styles.root}>
      <AppText color="muted">Letras que se confundem e o detalhe que as separa.</AppText>
      {list.map((l) => (
        <Card key={l.id}>
          <View style={styles.pair}>
            {l.chars.map((c) => (
              <View key={c} style={[styles.pairChar, { backgroundColor: colors.lilacSoft }]}>
                <AppText style={styles.glyph}>{c}</AppText>
                <AppText variant="caption" color="muted">
                  {getItem(c).label}
                </AppText>
              </View>
            ))}
          </View>
          <AppText>{l.tip}</AppText>
          <Button label="Treinar estas letras" variant="soft" onPress={() => onPractice(l.chars)} />
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  grid: { gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.xs },
  cell: { flex: 1, minHeight: 56, borderRadius: radii.md, borderWidth: 1.5, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xs },
  glyph: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 30 },
  detail: { gap: spacing.sm, borderRadius: radii.md, padding: spacing.md },
  big: { fontFamily: fonts.bold, fontSize: 72, lineHeight: 88, textAlign: 'center' },
  options: { gap: spacing.sm },
  pair: { flexDirection: 'row', gap: spacing.sm },
  pairChar: { flex: 1, alignItems: 'center', borderRadius: radii.md, paddingVertical: spacing.sm },
});
