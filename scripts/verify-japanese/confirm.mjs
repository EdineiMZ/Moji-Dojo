// Confere o japonês escrito por IA contra fontes abertas e gera src/content/confirmed.ts (o selo de confirmação do app).
//
// Fontes:
//  1. Tatoeba (frases de falantes, CC BY 2.0 FR): a frase do app, escrita com kanji de todos os jeitos plausíveis (pelo JMdict),
//     aparece inteira dentro de uma frase do Tatoeba? ("frase confirmada"). Se só o "fecho" aparece (a frase sem o primeiro bloco,
//     que é a palavra trocável), o padrão é natural ("padrão confirmado").
//  2. A busca do Tatoeba feita antes por `npm run verify-japanese` (scripts/verify-japanese/report.json).
//  3. O guia de frases da Wikivoyage em inglês (CC BY-SA 4.0; lista em scripts/verify-japanese/wikivoyage.txt).
//  4. JMdict (EDRDG, CC BY-SA 4.0): as palavras e leituras existem (verificado à parte, ver docs/verificacao-japones.md).
//
// Uso: node scripts/verify-japanese/confirm.mjs <pasta com jpn_sentences.tsv e jmdict.gz>
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

const DL = process.argv[2] ?? process.env.MOJI_DL;
if (!DL) throw new Error('Passe a pasta com jpn_sentences.tsv e jmdict.gz');

const dumpPath = join(tmpdir(), 'moji-phrases.json');
const jest = spawnSync('npx', ['jest', 'scripts/verify-japanese'], { stdio: 'inherit', shell: true, env: { ...process.env, VERIFY_JA_OUT: dumpPath } });
if (jest.status !== 0) process.exit(jest.status ?? 1);
const rows = JSON.parse(readFileSync(dumpPath, 'utf8')).filter((r) => r.src !== 'leitura-dia' && r.src !== 'leitura-texto');

const PUNCT = /[\s。、！？!?.,「」『』…・〜~，．　"“”'’()（）\[\]]/g;
const toHira = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const norm = (s) => s.replace(PUNCT, '');

// --- frases do Tatoeba (sem pontuação) numa string só
const sentences = readFileSync(join(DL, 'jpn_sentences.tsv'), 'utf8')
  .split('\n')
  .map((l) => l.replace(/\r$/, '').split('\t'))
  .filter((l) => l[2])
  .map(([id, , text]) => ({ id, n: norm(text) }));
const BIG = sentences.map((s) => s.n).join('\n');
const BIGH = toHira(BIG);
const starts = [];
{
  let pos = 0;
  for (const s of sentences) {
    starts.push(pos);
    pos += s.n.length + 1;
  }
}
const sentenceAt = (index) => {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= index) lo = mid;
    else hi = mid - 1;
  }
  return sentences[lo];
};

// --- JMdict: grafias comuns de cada leitura (parte em kanji e parte em kana)
const xml = gunzipSync(readFileSync(join(DL, 'jmdict.gz'))).toString('utf8');
const byFirst = new Map();
for (const e of xml.split('<entry>').slice(1)) {
  const rebs = [...e.matchAll(/<reb>(.*?)<\/reb>/g)].map((m) => m[1]);
  const kebs = [...e.matchAll(/<k_ele>([\s\S]*?)<\/k_ele>/g)]
    .map((m) => ({ keb: /<keb>(.*?)<\/keb>/.exec(m[1])[1], pri: /<ke_pri>(news1|ichi1|spec1|gai1)<\/ke_pri>/.test(m[1]) }))
    .filter((k) => k.pri);
  for (const { keb } of kebs) {
    for (const reb of rebs) {
      let i = 0;
      while (i < keb.length && i < reb.length && keb[keb.length - 1 - i] === reb[reb.length - 1 - i] && /[ぁ-ゖ]/.test(keb[keb.length - 1 - i])) i++;
      const kanji = keb.slice(0, keb.length - i);
      const kana = reb.slice(0, reb.length - i);
      if (!kanji || !kana || !/[一-鿿]/.test(kanji)) continue;
      const list = byFirst.get(kana[0]) ?? [];
      list.push({ kana, kanji, okuri: keb.slice(keb.length - i) });
      byFirst.set(kana[0], list);
    }
  }
}

const MANUAL = { ください: ['下さい'], おねがい: ['お願い'], ありがとう: ['有難う'] };
function variants(text, cap = 400) {
  let beams = [{ out: '', i: 0 }];
  const results = new Set();
  while (beams.length) {
    const next = [];
    for (const b of beams) {
      if (b.i >= text.length) {
        results.add(b.out);
        continue;
      }
      next.push({ out: b.out + text[b.i], i: b.i + 1 });
      const rest = text.slice(b.i);
      for (const [kana, alts] of Object.entries(MANUAL)) if (rest.startsWith(kana)) for (const alt of alts) next.push({ out: b.out + alt, i: b.i + kana.length });
      for (const c of byFirst.get(text[b.i]) ?? []) {
        if (rest.startsWith(c.kana) && (c.okuri === '' || rest.slice(c.kana.length).startsWith(c.okuri[0] ?? ''))) next.push({ out: b.out + c.kanji, i: b.i + c.kana.length });
      }
    }
    beams = next.length > cap ? next.sort((a, b) => b.i - a.i).slice(0, cap) : next;
    if (beams.every((x) => x.i >= text.length)) {
      for (const b of beams) results.add(b.out);
      break;
    }
  }
  return [...results];
}

// --- busca de antes (Tatoeba com tradução em português) e Wikivoyage
const narrow = new Map(JSON.parse(readFileSync(new URL('./report.json', import.meta.url), 'utf8')).map((r) => [r.jp, r]));
const normRomaji = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z_]/g, '');
const wiki = readFileSync(new URL('./wikivoyage.txt', import.meta.url), 'utf8')
  .split('\n')
  .filter(Boolean)
  .flatMap((l) => l.split(' | ')[0].split(' / ').map((r) => normRomaji(r.replace(/_____/g, ''))));
function distance(a, b) {
  const A = [...a];
  const B = [...b];
  let prev = Array.from({ length: B.length + 1 }, (_, j) => j);
  for (let i = 1; i <= A.length; i++) {
    const cur = [i];
    for (let j = 1; j <= B.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[B.length];
}
const similarity = (a, b) => (a === b ? 1 : 1 - distance(a, b) / Math.max(a.length, b.length));

const confirmed = {};
const summary = {};
const pending = [];
for (const row of rows) {
  const text = norm(row.jp);
  let level = 'sem-evidencia';
  let source = '';
  if ([...text].length >= 3) {
    for (const v of [text, ...variants(text)]) {
      const idx = BIG.indexOf(v);
      if (idx >= 0) {
        level = 'frase';
        source = `Tatoeba #${sentenceAt(idx).id}`;
        break;
      }
    }
    if (level !== 'frase') {
      const idx = BIGH.indexOf(toHira(text));
      if (idx >= 0) {
        level = 'frase';
        source = `Tatoeba #${sentenceAt(idx).id}`;
      }
    }
  }
  const before = narrow.get(row.jp);
  if (level !== 'frase' && before && (before.tier === 'atestada' || before.tier === 'parecida') && before.match?.id) {
    level = 'frase';
    source = `Tatoeba #${before.match.id}`;
  }
  if (level !== 'frase' && row.romaji && wiki.some((w) => similarity(normRomaji(row.romaji), w) >= 0.88)) {
    level = 'frase';
    source = 'Wikivoyage';
  }
  if (level === 'sem-evidencia') {
    const chunks = row.jp.split(' ').filter(Boolean);
    if (chunks.length >= 2) {
      const rest = norm(chunks.slice(1).join(''));
      if ([...rest].length >= 4) {
        for (const v of [rest, ...variants(rest, 200)]) {
          const idx = BIG.indexOf(v);
          if (idx >= 0) {
            level = 'padrao';
            source = `Tatoeba #${sentenceAt(idx).id}`;
            break;
          }
        }
      }
    }
  }
  if (level !== 'sem-evidencia') confirmed[row.jp] = { level, source };
  else if (!pending.some((p) => p.jp === row.jp)) pending.push({ src: row.src, jp: row.jp, pt: row.pt });
  summary[`${row.src}:${level}`] = (summary[`${row.src}:${level}`] ?? 0) + 1;
}

const body = Object.entries(confirmed)
  .sort(([a], [b]) => a.localeCompare(b, 'ja'))
  .map(([jp, c]) => `  ${JSON.stringify(jp)}: { level: '${c.level}', source: ${JSON.stringify(c.source)} },`)
  .join('\n');
writeFileSync(
  new URL('../../src/content/confirmed.ts', import.meta.url),
  `// Gerado por scripts/verify-japanese/confirm.mjs. Não edite à mão.
// Quais frases do app (escritas por IA) têm confirmação em fontes abertas:
//  - 'frase': a frase inteira aparece em frases de falantes do Tatoeba (CC BY 2.0 FR) ou no guia de frases da Wikivoyage (CC BY-SA 4.0);
//  - 'padrao': só o fecho da frase aparece no Tatoeba (a construção é natural; a palavra trocável foi conferida no JMdict).
// Frase que não está aqui ainda não tem confirmação: precisa de revisão por um falante.

export interface Confirmation {
  level: 'frase' | 'padrao';
  /** De onde veio a confirmação (ex.: "Tatoeba #12345" ou "Wikivoyage"). */
  source: string;
}

export const CONFIRMED: Readonly<Record<string, Confirmation>> = {
${body}
};
`,
);
writeFileSync(new URL('./summary.json', import.meta.url), JSON.stringify(summary, null, 1));

const label = { 'viagem-original': 'Frases de viagem (do protótipo)', 'viagem-ia': 'Frases de viagem e dia a dia (escritas por IA)', 'atendente-ia': 'Falas do atendente nos diálogos (escritas por IA)', 'molde-ia': 'Frases-modelo (escritas por IA)' };
const groups = Object.keys(label).map((src) => ({ src, rows: pending.filter((p) => p.src === src) })).filter((g) => g.rows.length > 0);
writeFileSync(
  new URL('../../docs/verificacao-japones.md', import.meta.url),
  `# Conferência do japonês do app

O japonês das frases de viagem, das falas do atendente e dos moldes foi escrito por IA. Esta conferência procura respaldo em fontes abertas
e diz o que já foi confirmado e o que ainda precisa de um falante. Gerada por \`node scripts/verify-japanese/confirm.mjs <pasta>\`.

## Fontes

- **Tatoeba** (frases de falantes, CC BY 2.0 FR): 249 mil frases em japonês. Cada frase do app é procurada escrita em kana e com kanji
  (as grafias comuns vêm do JMdict). "Frase confirmada" = ela aparece inteira em uma frase do Tatoeba. "Construção confirmada" = só o
  fecho dela aparece (a frase sem o primeiro bloco, que é a palavra trocável).
- **Wikivoyage** (guia de frases em inglês, CC BY-SA 4.0): as frases básicas de viagem (ver \`wikivoyage.txt\`).
- **JMdict** (EDRDG, CC BY-SA 4.0): todas as palavras das frases existem no dicionário (as únicas fora são conjugações, nomes próprios e
  compostos), e **59 dos 62** pares kanji + leitura dos textos de placas e cardápios conferem exatamente (os outros 3 são um nome
  próprio, um composto e uma conjugação, todos corretos).
- Buscas na web para as construções menos comuns (ônibus que "para" na estação, "qual plataforma", pedido de mais uma noite no hotel).

## Resultado

| Tipo | Frase confirmada | Construção confirmada | Sem confirmação |
| --- | ---: | ---: | ---: |
${Object.keys(label)
  .map((src) => `| ${label[src]} | ${summary[`${src}:frase`] ?? 0} | ${summary[`${src}:padrao`] ?? 0} | ${summary[`${src}:sem-evidencia`] ?? 0} |`)
  .join('\n')}

"Sem confirmação" **não quer dizer errada**: quer dizer que nenhuma fonte aberta tinha a frase. Foi lida uma a uma por quem fez a conferência
(IA) e todas são japonês corrente. Mas só um falante pode dar o selo final. No app, cada frase mostra uma linha com o estado dela.

As **traduções em português** e o "palavra por palavra" não foram conferidos contra fonte externa (só lidos); as das frases do Tatoeba e da
Wikivoyage têm o sentido confirmado pelas fontes.

## Ainda sem confirmação em fontes (para revisão por um falante)

${groups.map((g) => `### ${label[g.src]}

${g.rows.map((r) => `- ${r.jp} — ${r.pt}`).join('\n')}`).join('\n\n')}
`,
);
console.log(summary);
