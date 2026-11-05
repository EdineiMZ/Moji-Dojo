import type { StrokeData } from '@/data/types';
import { flattenPath, type Point } from '@/features/strokes/svgPath';
import { alignToModel, assignMinCost, meanDistance, resample, sliceStroke } from './geometry';

/**
 * Distância média (em unidades do KanjiVG, quadro de 109) a partir da qual um traço não vale nada.
 * Quanto menor, mais exigente. Calibrar com o desenho no celular.
 */
export const MAX_STROKE_DISTANCE = 18;
/** Até esta distância média o traço conta como "no lugar" (para o feedback ✓ / ↺ / ✗). */
export const OK_STROKE_DISTANCE = 10;

/**
 * Tolerância a traço encurtado (quem não termina o rabisco final de そ, ん, の...). O traço do modelo também é comparado só com
 * o começo ou só com o fim dele, nestas frações do comprimento; cada fração que falta custa `MISSING_PENALTY` unidades de
 * distância (por traço inteiro que faltasse). Encurtar um pouco quase não pesa; encurtar muito continua pesando. Os cortes de
 * nota não mudam.
 */
export const COVERAGES = [0.95, 0.9, 0.85, 0.8] as const;
export const MISSING_PENALTY = 30;
/** Só tenta alinhar pelo modelo encurtado quando a nota normal ficou abaixo disto. */
const TRIM_RETRY_BELOW = 92;
/**
 * Pontos descontados da nota quando ela só sai com a hipótese de traço encurtado. Testar várias hipóteses é um segundo palpite
 * que o desenho normal não tem; o desconto impede que isso vire folga para o caractere parecido (れ contra わ, ぬ contra め).
 */
export const TRIM_HYPOTHESIS_COST = 5;

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

/** Nota mínima para quem está começando um caractere: desenhar de memória é difícil, então a régua sobe aos poucos. */
export const WRITE_PASS_FIRST = 50;

/**
 * Nota mínima para acertar o desenho de um caractere, pela caixa dele na revisão (1 a 6; sem caixa = ainda não estudado).
 * Começa em 50% e sobe 5 pontos por caixa até os 70% de quem já domina. Errar derruba a caixa e a régua volta a ser mais branda.
 */
export const writePassScore = (box?: number): number => {
  const level = Math.max(1, Math.min(box ?? 1, 5));
  return Math.min(WRITE_PASS_SCORE, WRITE_PASS_FIRST + (level - 1) * 5);
};

export const isPassing = (score: WritingScore, need: number = WRITE_PASS_SCORE): boolean => score.pct >= need;

interface Variant {
  pts: Point[];
  /** Fração do traço do modelo que esta variante não cobre (0 = inteiro). */
  missing: number;
  /** Qual trecho do modelo: o traço inteiro, só o começo (o fim foi cortado) ou só o fim (o começo foi cortado). */
  part: 'full' | 'start' | 'end';
}

/** O traço do modelo inteiro e também só o começo ou só o fim dele (ver `COVERAGES`). */
function variantsOf(stroke: Point[]): Variant[] {
  const out: Variant[] = [{ pts: resample(stroke), missing: 0, part: 'full' }];
  for (const c of COVERAGES) {
    out.push({ pts: resample(sliceStroke(stroke, 0, c)), missing: 1 - c, part: 'start' });
    out.push({ pts: resample(sliceStroke(stroke, 1 - c, 1)), missing: 1 - c, part: 'end' });
  }
  return out;
}

/**
 * Distância do traço do modelo ao desenhado: a menor entre as variantes dadas, cada uma com a penalidade do que faltou.
 * Com o traço inteiro primeiro na lista, as variantes encurtadas só entram se ainda puderem ganhar.
 */
function toleranceDistance(variants: readonly Variant[], drawn: readonly Point[]): number {
  let best = Infinity;
  for (const variant of variants) {
    const penalty = MISSING_PENALTY * variant.missing;
    if (penalty >= best) continue;
    best = Math.min(best, meanDistance(variant.pts, drawn, best - penalty) + penalty);
  }
  return best;
}

interface PreparedModel {
  strokes: Point[][];
  variants: Variant[][];
}

/** O modelo já aberto em pontos e com as variantes encurtadas: calculado uma vez por modelo (os modelos não mudam). */
const prepared = new WeakMap<StrokeData, PreparedModel>();
function preparedModel(model: StrokeData): PreparedModel {
  let entry = prepared.get(model);
  if (!entry) {
    const strokes = model.p.map(flattenPath);
    entry = { strokes, variants: strokes.map(variantsOf) };
    prepared.set(model, entry);
  }
  return entry;
}

interface Evaluation {
  pct: number;
  strokes: StrokeVerdict[];
}

/**
 * Casa os traços do desenho com os do modelo, depois de alinhar o desenho à caixa de `alignRef` (o modelo inteiro, ou o modelo
 * já encurtado quando o desenho foi encurtado).
 */
function evaluate(
  variants: readonly (readonly Variant[])[],
  drawn: readonly (readonly Point[])[],
  alignRef: readonly (readonly Point[])[],
  tuning: ScoreTuning,
): Evaluation {
  const m = variants.length;
  const n = drawn.length;
  const common = Math.min(m, n);

  const aligned = alignToModel(drawn, drawn.slice(0, common), alignRef.slice(0, common));
  const drawnPts = aligned.map((st) => resample(st));

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
      const a = variants[i];
      const b = drawnPts[j];
      if (!a || !b) {
        // Linha ou coluna de enchimento: não existe esse par.
        forward[i]?.push(Infinity);
        reverse[i]?.push(Infinity);
        cost[i]?.push(1);
        continue;
      }
      const f = toleranceDistance(a, b);
      const r = toleranceDistance(a, [...b].reverse());
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
  return { pct: Math.round((similarity / size) * 100), strokes };
}

/**
 * Confere o desenho com o modelo, traço a traço (geometria, não pixels):
 * 1. alinha o desenho ao modelo em posição e escala;
 * 2. reamostra cada traço em pontos igualmente espaçados;
 * 3. casa cada traço do modelo com o desenho mais parecido, sem depender da ordem
 *    (direção e ordem entram só no feedback);
 * 4. a nota é a média das semelhanças, dividida pelo maior número de traços (modelo ou desenho),
 *    então faltar traço ou sobrar traço custa nota.
 *
 * Traço final encurtado (não terminar o rabisco de そ, ん, の...) é tolerado de forma proporcional: o traço do modelo também é
 * comparado só com o começo ou só com o fim dele, e o alinhamento é refeito com o modelo encurtado quando a primeira nota fica
 * baixa. O que falta custa distância (`MISSING_PENALTY`), então encurtar muito continua sendo nota baixa.
 */
export function scoreWriting(
  model: StrokeData,
  drawn: readonly (readonly Point[])[],
  tuning: ScoreTuning = { maxStrokeDistance: MAX_STROKE_DISTANCE, okStrokeDistance: OK_STROKE_DISTANCE },
): WritingScore {
  const { strokes: expectedStrokes, variants } = preparedModel(model);
  const m = expectedStrokes.length;
  const n = drawn.length;

  let best = evaluate(variants.map((vs) => vs.filter((v) => v.part === 'full')), drawn, expectedStrokes, tuning);
  // Encurtar o traço não muda a quantidade de traços: com outra quantidade, o desenho não é uma versão encurtada do modelo.
  // A hipótese "todos os traços perderam o fim (ou o começo) em X%" é testada de forma consistente: o desenho é alinhado ao
  // modelo encurtado e só é comparado com ele, senão a escolha do melhor alinhamento daria folga a qualquer caractere parecido.
  if (best.pct < TRIM_RETRY_BELOW && n === m) {
    for (const c of COVERAGES) {
      const hypotheses = [
        { part: 'start' as const, ref: expectedStrokes.map((st) => sliceStroke(st, 0, c)) },
        { part: 'end' as const, ref: expectedStrokes.map((st) => sliceStroke(st, 1 - c, 1)) },
      ];
      for (const { part, ref } of hypotheses) {
        const only = variants.map((vs) => vs.filter((v) => v.part === part && Math.abs(v.missing - (1 - c)) < 1e-9));
        const tried = evaluate(only, drawn, ref, tuning);
        const pct = tried.pct - TRIM_HYPOTHESIS_COST;
        if (pct > best.pct) best = { ...tried, pct };
      }
    }
  }

  const { pct, strokes } = best;
  const allRight = n === m && strokes.every((st) => st === 'ok');
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
