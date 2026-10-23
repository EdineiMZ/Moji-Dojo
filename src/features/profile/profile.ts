/** O perfil de quem usa o app (fica no aparelho, junto das preferências; não vai para o backup). */
export interface Profile {
  /** Nome que o Mochi usa para chamar a pessoa. Vazio = sem nome. */
  username: string;
  /** A introdução (nome, funções, meta e lembretes) já foi feita ou pulada. */
  onboarded: boolean;
  /** Meta de estudo por dia, em minutos. 0 = sem meta de tempo. */
  goalMinutes: number;
}

export const DEFAULT_PROFILE: Profile = { username: '', onboarded: false, goalMinutes: 15 };

export const GOAL_OPTIONS = [10, 15, 20, 30, 45] as const;
export const USERNAME_MAX = 20;

/** Tira espaços das pontas e repetidos, caracteres de controle, e limita o tamanho. */
export function cleanUsername(raw: string): string {
  // eslint-disable-next-line no-control-regex
  return raw.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, USERNAME_MAX).trim();
}

/** Um nome serve se tiver de 1 a 20 caracteres depois de limpo. */
export const isValidUsername = (raw: string): boolean => cleanUsername(raw).length >= 1;

/** Lê o perfil guardado, corrigindo o que estiver estranho (campo faltando, meta fora da lista...). */
export function sanitizeProfile(raw: unknown): Profile {
  const r = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  const goal = typeof r.goalMinutes === 'number' && Number.isFinite(r.goalMinutes) ? Math.round(r.goalMinutes) : DEFAULT_PROFILE.goalMinutes;
  return {
    username: typeof r.username === 'string' ? cleanUsername(r.username) : '',
    onboarded: r.onboarded === true,
    goalMinutes: goal <= 0 ? 0 : Math.min(goal, 180),
  };
}

/** Como chamar a pessoa numa frase ("Maria," ou nada). */
export const callName = (username: string): string => (username ? `${username}, ` : '');
