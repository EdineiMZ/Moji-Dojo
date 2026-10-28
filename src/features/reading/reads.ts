import { READINGS } from '@/content/readings';

/** Lê os textos lidos que vieram do disco ou do backup: só ids de textos que existem, com um momento válido. */
export function sanitizeReads(raw: unknown): Record<string, number> {
  if (typeof raw !== 'object' || raw === null) return {};
  const known = new Set(READINGS.map((t) => t.id));
  const out: Record<string, number> = {};
  for (const [id, at] of Object.entries(raw as Record<string, unknown>)) {
    if (known.has(id) && typeof at === 'number' && Number.isFinite(at) && at > 0) out[id] = at;
  }
  return out;
}
