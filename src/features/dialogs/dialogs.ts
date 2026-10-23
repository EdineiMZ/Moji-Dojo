import { DIALOG_SCENES, type DialogOption, type DialogScene, type DialogTurn } from '@/content/dialogs';
import { shuffle, type Rng } from '@/features/quiz/quiz';
import type { TypingTarget } from '@/features/translate/TypingSession';
import { normalizeJapanese } from '@/features/translate/check';

export type YouTurn = Extract<DialogTurn, { kind: 'you' }>;

/** Ajuda que aparece nas respostas: só o japonês, com o romaji ou com a tradução. */
export type OptionHelp = 'none' | 'romaji' | 'pt';

export const OPTION_HELPS: readonly { value: OptionHelp; label: string }[] = [
  { value: 'none', label: 'Só japonês' },
  { value: 'romaji', label: 'Com romaji' },
  { value: 'pt', label: 'Com tradução' },
];

export const findScene = (id: string): DialogScene | undefined => DIALOG_SCENES.find((s) => s.id === id);

export const isYouTurn = (turn: DialogTurn | undefined): turn is YouTurn => turn?.kind === 'you';

export const youTurns = (scene: DialogScene): YouTurn[] => scene.turns.filter(isYouTurn);

/** Posição do primeiro turno do aluno a partir de `from` (inclusive), ou -1 se não há mais. */
export function nextYouIndex(scene: DialogScene, from: number): number {
  for (let i = from; i < scene.turns.length; i++) if (isYouTurn(scene.turns[i])) return i;
  return -1;
}

/**
 * Quantos turnos ficam visíveis quando o aluno está no turno `current`: tudo até ele, inclusive. Sem turno atual
 * (fim da cena), todos.
 */
export const visibleCount = (scene: DialogScene, current: number): number => (current < 0 ? scene.turns.length : current + 1);

/** As respostas de um turno do aluno, em ordem sorteada. */
export const shuffledOptions = (turn: YouTurn, rng: Rng = Math.random): DialogOption[] => shuffle(turn.options, rng);

export const correctOption = (turn: YouTurn): DialogOption => turn.options.find((o) => o.ok) as DialogOption;

/** O texto de uma resposta com a ajuda pedida embaixo. */
export function optionLabel(option: DialogOption, help: OptionHelp): string {
  if (help === 'romaji') return `${option.jp}\n${option.romaji}`;
  if (help === 'pt') return `${option.jp}\n${option.pt}`;
  return option.jp;
}

/** As falas certas do aluno, para escrever de memória no fim da cena (a tradução é a dica). */
export function writeTargets(scene: DialogScene): TypingTarget[] {
  return youTurns(scene).map((turn, i) => {
    const option = correctOption(turn);
    return { id: `${scene.id}:${i}:${normalizeJapanese(option.jp)}`, prompt: option.pt, accepted: [option.jp], answer: option.jp, romaji: option.romaji };
  });
}
