// Limpeza da lista JLPT N5 (scripts/vocab-n5/n5.csv) para virar vocabulário do app.
// É CommonJS de propósito: o gerador (scripts/build-n5.mjs) e os testes (Jest) usam o mesmo código.
//
// O CSV vem de https://github.com/jamsinclair/open-anki-jlpt-decks (src/n5.csv): expression, reading,
// meaning (em inglês), tags, guid. Ele traz formas alternativas ("足; 脚"), "(する)" depois da leitura,
// "～" em sufixos e algumas palavras repetidas; aqui tudo isso é normalizado.

/** Lê CSV com campos entre aspas (vírgulas e aspas duplas dentro do campo). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((x) => x !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const KANA_ONLY = /^[ぁ-ゖァ-ヺー]+$/u;

/** Primeira forma de "a; b" sem os símbolos "～" e "〜" (sufixos), nem "(する)" ou "(〜を)". */
const firstForm = (text) =>
  text
    .split(';')[0]
    .replace(/\([^)]*\)/g, '')
    .replace(/[～〜~]/g, '')
    .trim();

/**
 * Linhas limpas: { row, jp, reading, en, lesson }. `row` é o número da linha no CSV (estável, usado pelas
 * traduções). `lesson` é a lição do Genki (livro-texto) em que a palavra aparece, ou null.
 * Devolve também as linhas puladas, com o motivo (palavra repetida ou leitura que não é só kana).
 */
function cleanRows(csvText) {
  const [header, ...data] = parseCsv(csvText);
  const col = (name) => header.indexOf(name);
  const [iExpr, iRead, iMean, iTags] = ['expression', 'reading', 'meaning', 'tags'].map(col);
  if ([iExpr, iRead, iMean, iTags].some((i) => i < 0)) throw new Error('CSV sem as colunas esperadas');

  const rows = [];
  const skipped = [];
  const seen = new Set();
  data.forEach((fields, i) => {
    const row = i + 1;
    const jp = firstForm(fields[iExpr] ?? '');
    const reading = firstForm(fields[iRead] ?? '');
    const en = (fields[iMean] ?? '').trim();
    if (!jp || !reading || !en) return skipped.push({ row, jp, reason: 'campo vazio' });
    if (!KANA_ONLY.test(reading)) return skipped.push({ row, jp, reason: `leitura não é só kana: ${reading}` });
    if (seen.has(jp)) return skipped.push({ row, jp, reason: 'palavra repetida (vale a primeira)' });
    seen.add(jp);
    const lessons = (fields[iTags] ?? '')
      .split(/\s+/)
      .map((t) => /^Genki_Ln\.(\d+)$/.exec(t))
      .filter(Boolean)
      .map((m) => Number(m[1]));
    rows.push({ row, jp, reading, en, lesson: lessons.length ? Math.min(...lessons) : null });
  });
  return { rows, skipped };
}

/** Ordem de estudo: pela lição do Genki (quem tem) e, dentro dela, a ordem do CSV (alfabética). */
function studyOrder(rows) {
  return [...rows].sort((a, b) => (a.lesson ?? 99) - (b.lesson ?? 99) || a.row - b.row);
}

module.exports = { parseCsv, cleanRows, studyOrder, firstForm };
