import { AppText } from '@/components';
import { confidenceOf } from './confidence';

/** Uma linha discreta sob a frase: se o japonês dela foi conferido em fontes abertas (e qual) ou se ainda espera revisão. */
export function ConfidenceNote({ jp }: { jp: string }) {
  const c = confidenceOf(jp);
  return (
    <AppText variant="caption" color={c.level === 'frase' ? 'ok' : 'muted'}>
      {c.label}
      {c.source ? ` (${c.source})` : ''}
    </AppText>
  );
}
