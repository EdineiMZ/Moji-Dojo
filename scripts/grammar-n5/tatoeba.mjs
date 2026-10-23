// Acesso ao Tatoeba (frases sob CC BY 2.0 FR) para os exemplos dos tópicos de gramática.

/** "[来|き]て[下|くだ]さい。" → "きてください。" (só a leitura em kana). */
export const readingOf = (hrkt) => hrkt.replace(/\[([^\]]+)\]/g, (_, inner) => inner.split('|').slice(1).join(''));

export async function search(query, page = 1) {
  const url = new URL('https://tatoeba.org/en/api_v0/search');
  url.search = new URLSearchParams({
    from: 'jpn',
    to: 'por',
    query,
    trans_filter: 'limit',
    trans_to: 'por',
    sort: 'words',
    page: String(page),
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

/** Uma frase da busca em um formato simples; `null` se não tiver leitura ou tradução em português. */
export function simplify(r) {
  const hrkt = r.transcriptions.find((t) => t.script === 'Hrkt');
  const pt = r.translations.flat().filter((t) => t.lang === 'por').map((t) => t.text);
  if (r.license !== 'CC BY 2.0 FR' || pt.length === 0) return null;
  return { id: r.id, text: r.text, reading: hrkt ? readingOf(hrkt.text) : r.text, pt };
}
