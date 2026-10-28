import type { OpenSourceItem } from '@/content/openSource';

export interface LicenseGroup {
  license: string;
  items: readonly OpenSourceItem[];
}

/** Termos que não são texto de licença livre: a tela mostra um botão que abre a página. */
export const LICENSE_LINKS: Readonly<Record<string, string>> = {
  'Android Software Development Kit License': 'https://developer.android.com/studio/terms',
  'ML Kit Terms of Service': 'https://developers.google.com/ml-kit/terms',
};

/** Agrupa por licença: a mais frequente primeiro (empate: ordem alfabética). */
export function groupByLicense(items: readonly OpenSourceItem[]): LicenseGroup[] {
  const map = new Map<string, OpenSourceItem[]>();
  for (const item of items) map.set(item.license, [...(map.get(item.license) ?? []), item]);
  return [...map.entries()]
    .map(([license, list]) => ({ license, items: list }))
    .sort((a, b) => b.items.length - a.items.length || a.license.localeCompare(b.license));
}

/** A página dos termos de um componente cuja licença é só um link (o endereço dele, ou o da licença). */
export const noticeLink = (item: OpenSourceItem): string | null => item.url ?? LICENSE_LINKS[item.license] ?? null;
