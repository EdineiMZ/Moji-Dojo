import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, ChipRow, Mascot, ProgressBar } from '@/components';
import { useNow } from '@/hooks/useNow';
import { plural } from '@/lib/plural';
import { useProgressStore } from '@/store';
import { fonts, spacing } from '@/theme';
import { cardKeysFor, CONJ_REVIEW_BATCH, conjCounts, dueCards, newVerbs, NEW_VERBS_BATCH } from './cards';
import { ConjugationReview } from './ConjugationReview';
import { VerbCard } from './VerbCard';
import type { Verb } from './verbs';

type Mode =
  | { kind: 'home' }
  | { kind: 'learn'; verbs: readonly Verb[] }
  | { kind: 'review'; keys?: readonly string[]; title?: string; typed?: boolean };

/** As regras em poucas linhas, para ler antes de treinar. */
function RulesCard() {
  return (
    <Card enterIndex={1}>
      <AppText variant="title">As regras</AppText>
      <AppText>
        <AppText style={styles.bold}>Grupo 2</AppText> (terminam em る depois de い ou え, como たべる): tire o る. たべる → たべます,
        たべない, たべて, たべた.
      </AppText>
      <AppText>
        <AppText style={styles.bold}>Grupo 1</AppText> (os outros, como のむ): muda o último som. ます usa a linha い (のみます), ない
        usa a linha あ (のまない), e て/た dependem do final: う, つ, る → って; む, ぶ, ぬ → んで; く → いて; ぐ → いで; す → して.
      </AppText>
      <AppText>
        <AppText style={styles.bold}>する e くる</AppText> são irregulares: します, しない, して, した e きます, こない, きて, きた.
        Exceções: いく faz いって e いった, e ある faz ない.
      </AppText>
      <AppText color="muted" variant="caption">
        Cuidado: alguns verbos em る são do grupo 1 (きる cortar, しる saber, かえる voltar). Cada verbo mostra o grupo dele.
      </AppText>
    </Card>
  );
}

/**
 * Treinador de conjugação: aprende verbos aos poucos (3 por vez) e revisa um cartão por verbo e forma
 * (ます, ない, て, た). Aprender coloca os cartões na revisão já vencidos, então dá para praticar na hora.
 */
export function ConjugationView() {
  const conj = useProgressStore((s) => s.conj);
  const learnVerbs = useProgressStore((s) => s.learnVerbs);
  const unlockConjForms = useProgressStore((s) => s.unlockConjForms);
  const now = useNow();
  const [mode, setMode] = useState<Mode>({ kind: 'home' });
  const [typed, setTyped] = useState(false);

  // Verbos aprendidos antes das formas extras existirem ganham os cartões novos aos poucos.
  useEffect(() => unlockConjForms(), [unlockConjForms]);

  const counts = conjCounts(conj, now);

  if (mode.kind === 'learn') {
    return (
      <View style={styles.root}>
        <AppText color="muted">
          Veja como cada verbo muda e ouça. Depois você escolhe a forma certa, uma por vez.
        </AppText>
        {mode.verbs.map((verb, i) => (
          <VerbCard key={verb.word.id} verb={verb} enterIndex={i} />
        ))}
        <Button
          label="Praticar esses verbos"
          onPress={() => {
            learnVerbs(mode.verbs.map((v) => v.word.id));
            setMode({ kind: 'review', keys: mode.verbs.flatMap(cardKeysFor), title: 'Praticando verbos novos', typed });
          }}
        />
        <Button label="Cancelar" variant="ghost" onPress={() => setMode({ kind: 'home' })} />
      </View>
    );
  }

  if (mode.kind === 'review') {
    return (
      <ConjugationReview
        {...(mode.keys ? { keys: mode.keys } : {})}
        {...(mode.title ? { title: mode.title } : {})}
        typed={mode.typed ?? false}
        onExit={() => setMode({ kind: 'home' })}
      />
    );
  }

  const due = dueCards(conj, now).length;
  const remaining = newVerbs(conj);
  return (
    <View style={styles.root}>
      <Card enterIndex={0}>
        <View style={styles.head}>
          <View style={styles.flex}>
            <AppText variant="title">Conjugação</AppText>
            <AppText color="muted">
              {counts.learned} de {counts.total} verbos aprendidos
            </AppText>
            <ProgressBar value={counts.total ? counts.learned / counts.total : 0} style={styles.bar} />
          </View>
          <Mascot mood={due > 0 ? 'neutral' : 'happy'} size={72} />
        </View>

        {due > 0 ? (
          <Button label={`Revisar agora (${Math.min(due, CONJ_REVIEW_BATCH)})`} onPress={() => setMode({ kind: 'review', typed })} />
        ) : (
          <AppText color="muted">
            {counts.learned > 0 ? 'Nenhuma revisão de conjugação pendente.' : 'Comece aprendendo os primeiros verbos.'}
          </AppText>
        )}
        <AppText variant="caption" color="muted">
          COMO RESPONDER
        </AppText>
        <ChipRow
          options={[
            { value: 'pick', label: 'Escolher' },
            { value: 'type', label: 'Digitar' },
          ]}
          value={typed ? 'type' : 'pick'}
          onChange={(v) => setTyped(v === 'type')}
        />
        {due > CONJ_REVIEW_BATCH ? (
          <AppText variant="caption" color="muted">
            {plural(due, 'cartão vencido', 'cartões vencidos')}: a revisão leva {CONJ_REVIEW_BATCH} por vez.
          </AppText>
        ) : null}

        {remaining.length > 0 ? (
          <Button
            label={`Aprender ${Math.min(NEW_VERBS_BATCH, remaining.length)} verbos novos`}
            variant={due > 0 ? 'soft' : 'primary'}
            onPress={() => setMode({ kind: 'learn', verbs: remaining.slice(0, NEW_VERBS_BATCH) })}
          />
        ) : (
          <AppText color="muted">Você já aprendeu a conjugar todos os verbos disponíveis.</AppText>
        )}

        <AppText variant="caption" color="muted">
          Cada verbo vira quatro cartões: ます, ない, て e た. Depois entram, aos poucos, ませんでした, たい, ている e ましょう. Digitar vale escrita com kanji ou em kana. As respostas erradas são as que mais aparecem no começo (a
          regra de outro grupo, o final de て errado). Quanto mais você acerta, mais espaçada fica a revisão.
        </AppText>
      </Card>
      <RulesCard />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  bar: { marginTop: spacing.xs },
  bold: { fontFamily: fonts.bold },
});
