/**
 * Retenção desejada do FSRS: o cartão volta quando a chance de lembrar cai a este valor. Mais alta = revisões mais frequentes
 * e menos esquecimento; mais baixa = menos revisões e mais esquecimento. Vive num módulo simples, atualizado pela store de
 * configurações (ver src/store/index.ts), para o agendamento não depender dela.
 */
export const RETENTION_OPTIONS: readonly number[] = [0.8, 0.85, 0.9, 0.95];
export const DEFAULT_RETENTION = 0.9;

let current = DEFAULT_RETENTION;

export const sanitizeRetention = (value: unknown): number => (typeof value === 'number' && RETENTION_OPTIONS.includes(value) ? value : DEFAULT_RETENTION);

export function setRetention(value: unknown): void {
  current = sanitizeRetention(value);
}

export const getRetention = (): number => current;
