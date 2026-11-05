import { initialDifficulty, initialStability } from './fsrs';
import type { SrsEntry } from './srs';

/**
 * Migração única (progresso v1 → v2). Até a v1, cada repetição na mesma sessão somava um esquecimento e recalculava a
 * estabilidade e a dificuldade (ver `answerReview`), então os contadores de esquecimento ("l") e a dificuldade dos itens
 * que o aluno mais errou estavam inflados: o い chegou a l=42, d=9,9 e s=0,1, preso na caixa 1.
 *
 * - zera o "l" de todos os cartões (o ranking de teimosos se reconstrói com a contagem certa);
 * - suaviza o que as repetições esmagaram: a dificuldade não passa da de um primeiro erro de cartão novo, e a estabilidade
 *   não fica abaixo da de um primeiro erro. Acertos, erros (c/w), caixa, vencimento e o resto do histórico não mudam.
 */
export const PROGRESS_VERSION_AFTER_LAPSE_FIX = 2;

/** Dificuldade máxima depois da migração: a de um cartão novo que errou de primeira. */
export const SMOOTHED_MAX_DIFFICULTY = initialDifficulty(1);
/** Estabilidade mínima (dias) depois da migração: a de um cartão novo que errou de primeira. */
export const SMOOTHED_MIN_STABILITY = initialStability(1);

type Cards = Readonly<Record<string, SrsEntry>>;

export function resetEntry(entry: SrsEntry): SrsEntry {
  const { l: _lapses, ...rest } = entry;
  if (rest.s === undefined || rest.d === undefined) return rest;
  return { ...rest, s: Math.max(rest.s, SMOOTHED_MIN_STABILITY), d: Math.min(rest.d, SMOOTHED_MAX_DIFFICULTY) };
}

export function resetCards(cards: Cards): Record<string, SrsEntry> {
  const out: Record<string, SrsEntry> = {};
  for (const [key, entry] of Object.entries(cards)) out[key] = resetEntry(entry);
  return out;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Os campos do progresso salvo que guardam cartões com esquecimentos. */
const CARD_FIELDS = ['srs', 'vocab', 'conj', 'particles'] as const;

/**
 * Aplica a migração ao estado salvo (como veio do disco). Quem não tem forma de objeto, ou campos que não são mapas de
 * cartões, passa intacto: a leitura segura do store cuida do resto. A contagem de teimosos do freio também recomeça, porque
 * foi medida com os contadores inflados.
 */
export function resetLapsesInSaved(saved: unknown): unknown {
  if (!isRecord(saved)) return saved;
  const next: Record<string, unknown> = { ...saved };
  for (const field of CARD_FIELDS) {
    const cards = saved[field];
    if (isRecord(cards)) next[field] = resetCards(cards as Cards);
  }
  if ('leechTrend' in saved) next.leechTrend = {};
  return next;
}
