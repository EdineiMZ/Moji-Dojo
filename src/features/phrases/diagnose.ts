import type { BuildExercise } from '@/data/types';
import { PARTICLES } from '@/features/cloze/cloze';

/** O que cada partícula faz, na terceira pessoa ("は marca o assunto..."). */
const ROLE: Readonly<Record<string, string>> = {
  は: 'marca o assunto da frase ("quanto a...")',
  が: 'aponta quem faz ou quem é, e apresenta a novidade',
  を: 'marca o objeto, o que sofre a ação (o que se come, se bebe, se compra)',
  に: 'marca o destino, a hora exata, a pessoa que recebe e onde algo está (ある/いる)',
  へ: 'marca a direção ("para")',
  で: 'marca o lugar onde a ação acontece e o meio ("de ônibus", "com a colher")',
  の: 'liga dois substantivos ("de": o livro do Yuki)',
  も: 'quer dizer "também" e toma o lugar de は, が ou を',
  と: 'quer dizer "e" (entre substantivos) ou "com" (alguém)',
  から: 'marca o ponto de partida ("de", "desde")',
  まで: 'marca o ponto final ("até")',
  より: 'marca com o que se compara ("do que")',
};

/** Pares que se confundem, com o que muda de sentido. A chave é o par em ordem alfabética, separado por "|". */
const PAIR_NOTE: Readonly<Record<string, string>> = {
  'が|は': 'は põe o assunto em foco ("quanto a..."); が aponta quem faz algo ou a novidade.',
  'で|に': 'に é o destino ("ir a"), a hora e onde algo existe; で é onde a ação acontece ("comer em") e o meio.',
  'に|を': 'を marca o que sofre a ação (o objeto); に marca para onde ou para quem.',
  'の|を': 'の liga dois substantivos ("de"); を liga o objeto ao verbo.',
  'で|を': 'を marca o objeto; で marca o lugar ou o meio da ação.',
  'も|は': 'は diz "quanto a..."; も troca isso por "também".',
  'と|に': 'と é "e" ou "com"; に é destino ou quem recebe.',
  'まで|から': 'から é onde começa ("de", "desde"); まで é onde termina ("até").',
  'と|も': 'と junta ("e", "com"); も quer dizer "também".',
};

/** O que cada final de frase diz, do mais longo para o mais curto (o primeiro que combina vale). */
const FORMS: readonly (readonly [string, string])[] = [
  ['ませんでした', 'passado negativo, "não ... (antes)"'],
  ['たくないです', 'negativo de querer, "não quero ..."'],
  ['てください', 'pedido, "por favor, ..."'],
  ['ませんか', 'convite, "que tal ...?"'],
  ['ましょう', 'sugestão, "vamos ..."'],
  ['たいです', 'desejo, "quero ..."'],
  ['ています', 'ação em andamento ou estado, "estou ..."'],
  ['ではありません', '"não é"'],
  ['じゃありません', '"não é"'],
  ['ください', 'pedido, "por favor"'],
  ['ません', 'negativo, "não ..."'],
  ['ました', 'passado, "...ei / ...ou"'],
  ['でした', '"era / foi"'],
  ['ですか', 'pergunta'],
  ['ます', 'presente ou futuro, "..."'],
  ['です', '"é / está"'],
];

const formLabel = (token: string): string | null => {
  if (PARTICLES.has(token) || token.length < 2) return null;
  return FORMS.find(([ending]) => token.endsWith(ending))?.[1] ?? null;
};

const pairKey = (a: string, b: string): string => [a, b].sort().join('|');

const count = (tokens: readonly string[]): Map<string, number> => {
  const map = new Map<string, number>();
  for (const t of tokens) map.set(t, (map.get(t) ?? 0) + 1);
  return map;
};

/** O que sobra em `from` depois de tirar `other` (como multiconjunto), na ordem de `from`. */
function minus(from: readonly string[], other: readonly string[]): string[] {
  const left = count(other);
  const rest: string[] = [];
  for (const t of from) {
    const n = left.get(t) ?? 0;
    if (n > 0) left.set(t, n - 1);
    else rest.push(t);
  }
  return rest;
}

const kindOf = (token: string): 'particle' | 'form' | 'word' =>
  PARTICLES.has(token) ? 'particle' : formLabel(token) ? 'form' : 'word';

/** Distância simples entre duas montagens: blocos diferentes pesam mais do que blocos fora do lugar. */
function cost(target: readonly string[], chosen: readonly string[]): number {
  const diff = minus(chosen, target).length + minus(target, chosen).length;
  const misplaced = chosen.filter((t, i) => target[i] !== t).length;
  return diff * 10 + misplaced;
}

/** A resposta aceita (a principal ou uma ordem alternativa) mais parecida com o que foi montado. */
export function closestAnswer(exercise: BuildExercise, chosen: readonly string[]): readonly string[] {
  let best = exercise.answer;
  for (const alt of exercise.alternatives ?? []) {
    if (cost(alt, chosen) < cost(best, chosen)) best = alt;
  }
  return best;
}

function swapLine(used: string, wanted: string): string {
  const head = `Você usou ${used} no lugar de ${wanted}.`;
  const kinds = [kindOf(used), kindOf(wanted)];
  if (kinds[0] === 'particle' && kinds[1] === 'particle') {
    const note = PAIR_NOTE[pairKey(used, wanted)];
    return `${head} ${note ?? `${used} ${ROLE[used] ?? 'é outra partícula'}; aqui a frase precisa de ${wanted}, que ${ROLE[wanted] ?? 'cumpre outro papel'}.`}`;
  }
  const a = formLabel(used);
  const b = formLabel(wanted);
  if (a && b) return `${head} O sentido muda: ${used} é ${a}; o que a frase pede é ${wanted}, ${b}.`;
  return head;
}

function orderLines(target: readonly string[], chosen: readonly string[]): string[] {
  const lines = ['Os blocos estão certos, mas a ordem não.'];
  const last = target.at(-1);
  if (last && chosen.at(-1) !== last && !PARTICLES.has(last)) {
    lines.push('Em japonês o verbo (ou o fim da frase) vai por último.');
  }
  const stray = chosen.findIndex((t, i) => PARTICLES.has(t) && (i === 0 || PARTICLES.has(chosen[i - 1] as string)));
  if (stray >= 0) lines.push(`A partícula ${chosen[stray]} vem logo depois da palavra que ela marca.`);
  if (lines.length === 1) {
    const at = chosen.findIndex((t, i) => target[i] !== t);
    if (at >= 0) lines.push(`Na posição ${at + 1} a frase pede ${target[at]}, e não ${chosen[at]}.`);
  }
  return lines;
}

/**
 * Explica, em português, o que a montagem errada mudou em relação à frase certa mais parecida: partícula trocada
 * (e o que cada uma faz), final de frase trocado, bloco que sobra ou que falta, ou só a ordem. Devolve uma lista
 * vazia se a montagem estiver certa.
 */
export function diagnose(exercise: BuildExercise, chosen: readonly string[]): string[] {
  const target = closestAnswer(exercise, chosen);
  if (target.join('|') === chosen.join('|')) return [];

  const used = minus(chosen, target);
  const missing = minus(target, chosen);
  if (used.length === 0 && missing.length === 0) return orderLines(target, chosen);

  const lines: string[] = [];
  const open = [...missing];
  for (const word of used) {
    const at = open.findIndex((t) => kindOf(t) === kindOf(word) && kindOf(t) !== 'word');
    if (at >= 0) {
      lines.push(swapLine(word, open[at] as string));
      open.splice(at, 1);
    } else if (kindOf(word) === 'particle') {
      lines.push(`A partícula ${word} sobra: ela ${ROLE[word] ?? 'não entra aqui'}, e esta frase não precisa dela.`);
    } else {
      const label = formLabel(word);
      lines.push(label ? `${word} (${label}) sobra: a frase não pede isso.` : `O bloco ${word} não faz parte desta frase.`);
    }
  }
  for (const word of open) {
    lines.push(
      PARTICLES.has(word) ? `Falta a partícula ${word}: ela ${ROLE[word] ?? 'liga as palavras'}.` : `Falta o bloco ${word}.`,
    );
  }
  return lines;
}

/** Outras respostas válidas, além da que o aluno montou (vazio se só há uma). */
export function otherValid(exercise: BuildExercise, chosen: readonly string[]): string[] {
  const built = chosen.join('|');
  return [exercise.answer, ...(exercise.alternatives ?? [])]
    .filter((a) => a.join('|') !== built)
    .map((a) => a.join(' '));
}
