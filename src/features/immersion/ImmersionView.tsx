import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Bold, Card, ChipRow, Collapsible } from '@/components';
import { spacing } from '@/theme';
import { CONVERSATION_WAYS, FIRST_CONVERSATION, IMMERSION, type ImmersionLevel } from './guide';

const LEVELS = IMMERSION.map((p) => ({ value: p.level, label: p.label }));

/** "Fora do app": a fluência vem de ouvir, ler e falar muito. Este guia diz o quê, por nível, e como começar a conversar. */
export function ImmersionView() {
  const [level, setLevel] = useState<ImmersionLevel>('n5');
  const plan = IMMERSION.find((p) => p.level === level) ?? IMMERSION[0]!;

  return (
    <View style={styles.root}>
      <AppText color="muted">
        O app ensina a base; a fluência acontece fora dele, ouvindo, lendo e conversando. Escolha o seu nível e veja por onde começar.
        Os nomes são exemplos: os sites mudam, então confira antes.
      </AppText>

      <ChipRow wrap options={LEVELS} value={level} onChange={setLevel} />

      <Card enterIndex={0}>
        <AppText variant="title">{plan.label}</AppText>
        <AppText color="muted">{plan.when}</AppText>
        {plan.steps.map((step) => (
          <View key={step.kind} style={styles.step}>
            <AppText>
              <Bold>{step.kind}: </Bold>
              {step.what}
            </AppText>
            <AppText variant="caption" color="muted">
              {step.examples}
            </AppText>
          </View>
        ))}
        <AppText>
          <Bold>Legendas: </Bold>
          {plan.subtitles}
        </AppText>
      </Card>

      <Card enterIndex={1}>
        <Collapsible title="Com quem conversar" hint="Tutor, troca de idiomas e comunidades">
          {CONVERSATION_WAYS.map((tip) => (
            <AppText key={tip.title}>
              <Bold>{tip.title}. </Bold>
              {tip.body}
            </AppText>
          ))}
        </Collapsible>
      </Card>

      <Card enterIndex={2}>
        <Collapsible title="Roteiro da primeira conversa" hint="15 a 20 minutos, passo a passo">
          {FIRST_CONVERSATION.map((tip) => (
            <AppText key={tip.title}>
              <Bold>{tip.title}. </Bold>
              {tip.body}
            </AppText>
          ))}
        </Collapsible>
      </Card>

      <AppText variant="caption" color="muted">
        Escrito por IA, a revisar por um falante de japonês.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  step: { gap: spacing.xs },
});
