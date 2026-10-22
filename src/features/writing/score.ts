import type { StrokeData } from '@/data/types';
import { flattenPath, type Point } from '@/features/strokes/svgPath';
import { alignToModel, assignMinCost, meanDistance, resample } from './geometry';

/**
 * Distância média (em unidades do KanjiVG, quadro de 109) a partir da qual um traço não vale nada.
 * Quanto menor, mais exigente. Calibrar com o desenho no celular.
 */
export const MAX_STROKE_DISTANCE = 18;
/** Até esta distância média o traço conta como "no lugar" (para o feedback ✓ / ↺ / ✗). */
export const OK_STROKE_DISTANCE = 10;

/** Nota a partir da qual a escrita é "boa" (cor verde na lição). */
export const GOOD_SCORE = 80;
export const FAIR_SCORE = 60;
/** Nota mínima para um acerto no modo "write" das revisões. */
export const WRITE_PASS_SCORE = 70;

/**
 * - ok: traço certo, na posição e na direção certas, na ordem certa
 * - rev: a forma está certa, mas foi desenhado ao contrário
 * - order: a forma está certa, mas foi desenhado em outra posição da sequência
 * - bad: não se parece com o traço do modelo
 * - miss: faltou
 */
export type StrokeVerdict = 'ok' | 'rev' | 'order' | 'bad' | 'miss';
export type ScoreLevel = 'ok' | 'warn' | 'bad';

export interface WritingScore {
  /** Semelhança com o modelo, de 0 a 100. Só a forma decide: ordem e direção não mudam a nota. */
  pct: number;
  level: ScoreLevel;
  /** Um veredito por traço do modelo, na ordem do modelo. */
  strokes: readonly StrokeVerdict[];
  expectedCount: number;
  drawnCount: number;
  verdict: string;
}

/** Limites ajustáveis (os padrões são as constantes acima). */
export interface ScoreTuning {
  maxStrokeDistance: number;
  okStrokeDistance: number;
}

export const isPassing = (score: WritingScore): boolean => score.pct >= WRITE_PASS_SCORE;

/**
 * Confere o desenho com o modelo, traço a traço (geometria, não pixels):
 * 1. alinha o desenho ao modelo em posição e escala;
 * 2. reamostra cada traço em pontos igualmente espaçados;
 * 3. casa cada traço do modelo com o desenho mais parecido, sem depender da ordem
 *    (direção e ordem entram só no feedback);
 * 4. a nota é a média das semelhanças, dividida pelo maior número de traços (modelo ou desenho),
 *    então faltar traço ou sobrar traço custa nota.
 */
export function scoreWriting(
  model: StrokeData,
  drawn: readonly (readonly Point[])[],
  tuning: ScoreTuning = { maxStrokeDistance: MAX_STROKE_DISTANCE, okStrokeDistance: OK_STROKE_DISTANCE },
): WritingScore {
  const expectedStrokes = model.p.map(flattenPath);
  const m = expectedStrokes.length;
  const n = drawn.length;
  const common = Math.min(m, n);

  const aligned = alignToModel(drawn, drawn.slice(0, common), expectedStrokes.slice(0, common));
  const modelPts = expectedStrokes.map((s) => resample(s));
  const drawnPts = aligned.map((s) => resample(s));

  const size = Math.max(m, n);
  // Distâncias (na direção certa e invertida) entre cada traço do modelo (i) e do desenho (j).
  const forward: number[][] = [];
  const reverse: number[][] = [];
  const cost: number[][] = [];
  for (let i = 0; i < size; i++) {
    forward.push([]);
    reverse.push([]);
    cost.push([]);
    for (let j = 0; j < size; j++) {
      const a = modelPts[i];
      const b = drawnPts[j];
      if (!a || !b) {
        // Linha ou coluna de enchimento: não existe esse par.
        forward[i]?.push(Infinity);
        reverse[i]?.push(Infinity);
        cost[i]?.push(1);
        continue;
      }
      const f = meanDistance(a, b);
      const r = meanDistance(a, [...b].reverse());
      forward[i]?.push(f);
      reverse[i]?.push(r);
      cost[i]?.push(Math.min(1, Math.min(f, r) / tuning.maxStrokeDistance));
    }
  }
  const match = assignMinCost(cost);

  let similarity = 0;
  const strokes: StrokeVerdict[] = [];
  for (let i = 0; i < m; i++) {
    const j = match[i] ?? -1;
    if (j < 0 || j >= n) {
      strokes.push('miss');
      continue;
    }
    const f = forward[i]?.[j] ?? Infinity;
    const r = reverse[i]?.[j] ?? Infinity;
    similarity += 1 - (cost[i]?.[j] ?? 1);
    if (f <= tuning.okStrokeDistance) strokes.push(j === i ? 'ok' : 'order');
    else if (r <= tuning.okStrokeDistance) strokes.push('rev');
    else strokes.push('bad');
  }

  const pct = Math.round((similarity / size) * 100);
  const allRight = n === m && strokes.every((s) => s === 'ok');
  const verdict =
    pct >= GOOD_SCORE
      ? allRight
        ? 'Ótimo, forma e ordem certas.'
        : 'Forma boa. Confira a ordem dos traços.'
      : pct >= FAIR_SCORE
        ? 'Quase lá. Compare com o modelo.'
        : 'Ainda longe do modelo. Tente decalcando primeiro.';

  return {
    pct,
    level: pct >= GOOD_SCORE ? 'ok' : pct >= FAIR_SCORE ? 'warn' : 'bad',
    strokes,
    expectedCount: m,
    drawnCount: n,
    verdict,
  };
}

/** Texto curto de cada traço, para os "chips" do resultado. */
export function strokeLabel(verdict: StrokeVerdict, index: number): string {
  const n = index + 1;
  switch (verdict) {
    case 'ok':
      return `${n} ✓`;
    case 'rev':
      return `${n} ↺ invertido`;
    case 'order':
      return `${n} ↕ ordem`;
    case 'miss':
      return `${n} faltou`;
    default:
      return `${n} ✗`;
  }
}
