import { useState } from 'react';
import { AppText, Button, Card, ChipRow } from '@/components';
import { findWord } from '@/content';
import { learnedWordIds } from '@/features/vocab/cards';
import { useAiStore, useProgressStore } from '@/store';
import { AiDisclaimer } from './AiParts';
import { AiError } from './client';
import { PHRASE_TOPICS } from './tasks';
import { generateScene } from './tasksPractice';
import { useAiReady } from './useAi';

interface SceneGeneratorProps {
  /** Chamado com o id da cena criada, para a tela já abri-la. */
  onCreated: (id: string) => void;
}

/** "Criar cena com IA" dentro de Diálogos: uma cena nova de escolher a resposta, guardada para jogar sem internet. */
export function SceneGenerator({ onCreated }: SceneGeneratorProps) {
  const ready = useAiReady();
  const vocab = useProgressStore((s) => s.vocab);
  const addScene = useAiStore((s) => s.addScene);
  const [topic, setTopic] = useState(PHRASE_TOPICS[0]?.value ?? 'travel');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!ready) return null;

  const create = async () => {
    const chosen = PHRASE_TOPICS.find((t) => t.value === topic) ?? PHRASE_TOPICS[0];
    if (!chosen) return;
    setBusy(true);
    setError('');
    try {
      const known = [...learnedWordIds(vocab)].flatMap((id) => {
        const word = findWord(id);
        return word ? [word.jp] : [];
      });
      const now = Date.now();
      const scene = await generateScene({ topic: chosen, known, seed: now });
      const id = `ia${now.toString(36)}`;
      addScene({ id, title: scene.title, place: chosen.label, intro: scene.intro, turns: scene.turns });
      onCreated(id);
    } catch (e) {
      setError(e instanceof AiError ? e.message : 'Não consegui falar com a IA agora.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <AppText variant="title">✨ Cena nova com IA</AppText>
      <AppText color="muted">
        A IA monta uma cena nova no mesmo formato: alguém fala e você escolhe a resposta certa. As erradas explicam por que não servem. As cenas ficam guardadas para jogar sem internet.
      </AppText>
      <ChipRow options={PHRASE_TOPICS.map((t) => ({ value: t.value, label: t.label }))} value={topic} onChange={setTopic} />
      <Button label={busy ? 'Criando a cena...' : '✨ Criar uma cena'} onPress={create} disabled={busy} />
      {error ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
      <AiDisclaimer />
    </Card>
  );
}
