/** Preferências da checagem de atualização (ficam nos Ajustes; não vão para o backup). */
export interface UpdateSettings {
  /** Procura uma versão nova ao abrir o app, no máximo uma vez por dia. */
  autoCheck: boolean;
  /** Quando a última consulta deu certo (ms desde 1970; 0 = nunca). */
  lastCheckAt: number;
  /** Versão cujo aviso foi dispensado ("Depois"); só uma versão mais nova volta a avisar. */
  dismissed: string | null;
}

export const DEFAULT_UPDATES: UpdateSettings = { autoCheck: true, lastCheckAt: 0, dismissed: null };

/** Intervalo mínimo entre duas consultas automáticas. */
export const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

export function sanitizeUpdates(value: unknown): UpdateSettings {
  const v = typeof value === 'object' && value !== null ? (value as Partial<UpdateSettings>) : {};
  return {
    autoCheck: typeof v.autoCheck === 'boolean' ? v.autoCheck : DEFAULT_UPDATES.autoCheck,
    lastCheckAt: typeof v.lastCheckAt === 'number' && Number.isFinite(v.lastCheckAt) && v.lastCheckAt > 0 ? v.lastCheckAt : 0,
    dismissed: typeof v.dismissed === 'string' && v.dismissed.length <= 20 ? v.dismissed : null,
  };
}

/** Uma consulta automática é devida agora? (Ligada, e a última foi há mais de um dia ou o relógio voltou.) */
export function isCheckDue(settings: UpdateSettings, now: number): boolean {
  if (!settings.autoCheck) return false;
  return settings.lastCheckAt === 0 || now < settings.lastCheckAt || now - settings.lastCheckAt >= CHECK_INTERVAL_MS;
}
