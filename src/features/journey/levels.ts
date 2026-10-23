/** Nível a partir da experiência: o nível 2 vem com 50 pontos, o 3 com 200, o 4 com 450... (50 × (nível − 1)²). */
export const xpForLevel = (level: number): number => 50 * Math.max(0, level - 1) ** 2;

export const levelOf = (xp: number): number => Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1;

export interface LevelProgress {
  level: number;
  /** Experiência dentro do nível atual. */
  into: number;
  /** Quanto falta para o próximo nível, no total. */
  span: number;
}

export function levelProgress(xp: number): LevelProgress {
  const level = levelOf(xp);
  const start = xpForLevel(level);
  return { level, into: xp - start, span: xpForLevel(level + 1) - start };
}

/** Título do aluno por faixa de nível. */
const TITLES: readonly (readonly [number, string])[] = [
  [1, 'Broto'],
  [3, 'Aprendiz'],
  [5, 'Estudante'],
  [8, 'Explorador'],
  [12, 'Praticante'],
  [18, 'Veterano'],
  [25, 'Mestre do Dojo'],
];

export function titleFor(level: number): string {
  let title = TITLES[0]?.[1] ?? '';
  for (const [from, name] of TITLES) if (level >= from) title = name;
  return title;
}

/** Pétalas de presente ao subir de nível. */
export const levelUpPetals = (level: number): number => 10 + 2 * Math.min(level, 20);
