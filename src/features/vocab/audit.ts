import { VOCAB, type VocabWord } from '@/content';
import { clashesWith } from './questions';
import { sharesSense } from './senses';

/**
 * Auditoria do vocabulário: o que pode enganar quem estuda (palavras com a mesma leitura, sufixos, sentidos que se
 * repetem) e o tamanho do conjunto de alternativas de cada palavra. Gera docs/revisao-vocabulario.md (npm run audit-vocab).
 */

export interface SenseConflict {
  a: VocabWord;
  b: VocabWord;
}

export interface VocabAudit {
  total: number;
  /** Palavras cujo grupo e escrita não têm 3 alternativas válidas: usam o vocabulário inteiro (pool reduzido). */
  reducedPool: VocabWord[];
  /** Palavras sem 3 alternativas válidas mesmo no vocabulário inteiro (deve ser zero). */
  noPool: VocabWord[];
  /** Pares do mesmo grupo com sentido em comum mas significados diferentes: o filtro antigo deixava passar. */
  conflicts: SenseConflict[];
  /** Leituras com mais de uma escrita e significados diferentes. */
  homophones: VocabWord[][];
  /** Sufixos, prefixos, auxiliares e contadores. */
  affixes: VocabWord[];
  /** Palavras só de kana cuja entrada é uma terminação sem "〜" (candidatas a mostrar como 〜xxx). */
  kanaEndings: VocabWord[];
}

export const AFFIX = /sufixo|prefixo|auxiliar|contador/iu;

const near = (w: VocabWord, x: VocabWord): boolean => x.group === w.group || x.kind === w.kind;

export function auditVocab(words: readonly VocabWord[] = VOCAB): VocabAudit {
  const reducedPool: VocabWord[] = [];
  const noPool: VocabWord[] = [];
  const conflicts: SenseConflict[] = [];
  const byGroup = new Map<string, VocabWord[]>();
  for (const w of words) byGroup.set(w.group, [...(byGroup.get(w.group) ?? []), w]);

  for (const w of words) {
    let preferred = 0;
    let anywhere = 0;
    for (const c of words) {
      if (c.id === w.id) continue;
      // O ouvido é o caso mais estrito (também recusa homófonos): se serve nele, serve nas outras direções.
      if (clashesWith(w, c, 'au')) continue;
      anywhere++;
      if (near(w, c)) preferred++;
      if (anywhere >= 3 && preferred >= 3) break;
    }
    if (preferred < 3) reducedPool.push(w);
    if (anywhere < 3) noPool.push(w);
  }

  for (const group of byGroup.values()) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i] as VocabWord;
        const b = group[j] as VocabWord;
        if (a.meaning !== b.meaning && sharesSense(a, b)) conflicts.push({ a, b });
      }
    }
  }

  const byReading = new Map<string, VocabWord[]>();
  for (const w of words) byReading.set(w.reading, [...(byReading.get(w.reading) ?? []), w]);
  const homophones = [...byReading.values()].filter((g) => new Set(g.map((w) => w.jp)).size > 1 && new Set(g.map((w) => w.meaning)).size > 1);

  const affixes = words.filter((w) => AFFIX.test(w.meaning));
  const kanaEndings = words.filter((w) => w.jp === w.reading && /(にくい|やすい|がたい|づらい|っぽい|ぽい|がち|だらけ|まみれ|ごと|ずつ|らしい|そう|よう|みたい|はず|べき|たがる|すぎる)$/u.test(w.jp));

  return { total: words.length, reducedPool, noPool, conflicts, homophones, affixes, kanaEndings };
}

const row = (w: VocabWord): string => `${w.jp} (${w.reading}) = ${w.meaning} [${w.group}]`;

/** O relatório em Markdown, para o docs/revisao-vocabulario.md. */
export function renderAudit(audit: VocabAudit): string {
  const lines: string[] = [];
  lines.push('# Revisão do vocabulário', '');
  lines.push('Gerado por `npm run audit-vocab` (`src/features/vocab/audit.ts`). Não edite à mão.', '');
  lines.push('## Resumo', '');
  lines.push(`- Palavras analisadas: **${audit.total}**`);
  lines.push(`- Pool de alternativas reduzido (menos de 3 alternativas do mesmo grupo ou escrita; usam o vocabulário inteiro): **${audit.reducedPool.length}**`);
  lines.push(`- Sem 3 alternativas válidas em nenhum lugar: **${audit.noPool.length}**`);
  lines.push(`- Pares do mesmo grupo com um sentido em comum e significados diferentes (o filtro antigo deixava passar): **${audit.conflicts.length}**`);
  lines.push(`- Leituras com mais de uma escrita e sentidos diferentes (homófonos): **${audit.homophones.length}**`);
  lines.push(`- Sufixos, prefixos, auxiliares e contadores: **${audit.affixes.length}**`);
  lines.push(`- Palavras só de kana que são terminações e podem virar "〜xxx": **${audit.kanaEndings.length}**`, '');

  lines.push('## Pool reduzido', '');
  lines.push(audit.reducedPool.length === 0 ? 'Nenhuma.' : audit.reducedPool.map((w) => `- ${row(w)}`).join('\n'), '');

  lines.push('## Terminações escritas sem "〜"', '');
  lines.push(audit.kanaEndings.map((w) => `- ${row(w)}`).join('\n') || 'Nenhuma.', '');

  lines.push('## Sufixos, prefixos, auxiliares e contadores', '');
  lines.push(audit.affixes.map((w) => `- ${row(w)}`).join('\n') || 'Nenhum.', '');

  lines.push('## Sentidos em comum no mesmo grupo (primeiros 300)', '');
  lines.push(audit.conflicts.slice(0, 300).map(({ a, b }) => `- ${row(a)}  ×  ${row(b)}`).join('\n') || 'Nenhum.', '');

  lines.push('## Mesma leitura, escritas e sentidos diferentes (primeiros 300)', '');
  lines.push(audit.homophones.slice(0, 300).map((g) => `- ${g.map((w) => `${w.jp} = ${w.meaning}`).join('  /  ')}`).join('\n') || 'Nenhum.', '');
  return `${lines.join('\n')}\n`;
}
