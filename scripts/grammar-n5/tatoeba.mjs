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
  // O servidor do Tatoeba falha de vez em quando (502, 504, 429): tenta de novo, esperando um pouco mais a cada vez.
  for (let attempt = 1; ; attempt++) {
    let res;
    try {
      res = await fetch(url);
    } catch (error) {
      // Sem resposta (timeout de conexão, rede caindo): também vale tentar de novo.
      if (attempt >= 5) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
      continue;
    }
    if (res.ok) return res.json();
    if (attempt >= 5 || (res.status < 500 && res.status !== 429)) throw new Error(`${res.status} ${url}`);
    await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
  }
}

/** Uma frase pelo id (mesmo formato de um resultado da busca), para quando a busca por texto não a traz. `null` se não existe. */
export async function sentenceById(id) {
  const url = `https://tatoeba.org/en/api_v0/sentence/${id}`;
  for (let attempt = 1; ; attempt++) {
    let res;
    try {
      res = await fetch(url);
    } catch (error) {
      if (attempt >= 5) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
      continue;
    }
    if (res.ok) return res.json();
    if (res.status === 404) return null;
    if (attempt >= 5 || (res.status < 500 && res.status !== 429)) throw new Error(`${res.status} ${url}`);
    await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
  }
}

/** Uma frase da busca em um formato simples; `null` se não tiver leitura ou tradução em português. */
export function simplify(r) {
  const hrkt = r.transcriptions.find((t) => t.script === 'Hrkt');
  const pt = r.translations.flat().filter((t) => t.lang === 'por').map((t) => t.text);
  if (r.license !== 'CC BY 2.0 FR' || pt.length === 0) return null;
  return { id: r.id, text: r.text, reading: hrkt ? readingOf(hrkt.text) : r.text, pt };
}
