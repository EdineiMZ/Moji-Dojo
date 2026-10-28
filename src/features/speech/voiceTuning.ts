/** Ajustes da voz VOICEVOX além da velocidade: altura e entonação (ficam no aparelho, junto das preferências). */

/** Altura da voz (`pitchScale`): 0 é a original; o motor aceita de -0,15 a 0,15. */
export const PITCH_OPTIONS = [
  { value: '-0.1', label: 'Mais grave' },
  { value: '0', label: 'Normal' },
  { value: '0.1', label: 'Mais aguda' },
] as const;

/** Entonação (`intonationScale`): 1 é a original; abaixo fica mais monótona, acima mais expressiva. */
export const INTONATION_OPTIONS = [
  { value: '0.7', label: 'Suave' },
  { value: '1', label: 'Normal' },
  { value: '1.3', label: 'Expressiva' },
] as const;

export const DEFAULT_PITCH = 0;
export const DEFAULT_INTONATION = 1;

const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export const sanitizePitch = (v: unknown): number => (finite(v) ? Math.round(Math.max(-0.15, Math.min(0.15, v)) * 100) / 100 : DEFAULT_PITCH);
export const sanitizeIntonation = (v: unknown): number => (finite(v) ? Math.round(Math.max(0.5, Math.min(1.5, v)) * 100) / 100 : DEFAULT_INTONATION);

/** Estilo da voz do atendente nos diálogos: um número válido, ou null (a mesma voz de sempre). */
export const sanitizeStaffStyle = (v: unknown): number | null => (typeof v === 'number' && Number.isInteger(v) && v >= 0 ? v : null);

/** Favoritos: só textos, sem repetir, no máximo 60. */
export function sanitizeFavorites(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return [...new Set(v.filter((x): x is string => typeof x === 'string' && x.length > 0 && x.length < 60))].slice(0, 60);
}

/** Liga ou desliga um favorito (devolve uma lista nova). */
export const toggleFavorite = (list: readonly string[], slug: string): string[] => (list.includes(slug) ? list.filter((s) => s !== slug) : sanitizeFavorites([...list, slug]));

/** A busca casa com o nome (romanizado ou em japonês) ou com a descrição, sem diferenciar maiúsculas nem acentos. */
export function matchesSearch(query: string, ...fields: readonly string[]): boolean {
  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const q = norm(query);
  if (q === '') return true;
  return fields.some((f) => norm(f).includes(q));
}
