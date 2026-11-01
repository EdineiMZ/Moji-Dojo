import { VOCAB, findWord } from '@/content';
import { AFFIX, auditVocab, renderAudit } from './audit';
import { buildVocabOptions, buildVocabOptionsDetailed, buildVocabQuestions } from './questions';
import { cardKey, isKanaOnly } from './cards';
import { GENERIC_SENSES, normalizeSense, senseKeys, sharesSense } from './senses';

// Sem @types/node no projeto: tipos mínimos do que o teste usa.
const fs = require('node:fs') as { writeFileSync(file: string, data: string, encoding: 'utf8'): void };
const path = require('node:path') as { join(...parts: string[]): string };
declare const __dirname: string;

const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

describe('sentidos', () => {
  it('normaliza: sem acento, sem maiúsculas, sem comentário entre parênteses', () => {
    expect(normalizeSense('Difícil de (sufixo)')).toBe('dificil de');
    expect(normalizeSense('  Ódio ')).toBe('odio');
  });

  it('separa por ponto e vírgula e ignora os genéricos', () => {
    expect(senseKeys('odioso; detestável')).toEqual(['odioso', 'detestavel']);
    expect(senseKeys('fazer; ser; coisa')).toEqual([]);
    expect(GENERIC_SENSES.has('fazer')).toBe(true);
  });

  it('dois verbos que só dividem "fazer" não se confundem; os que dividem um sentido de verdade, sim', () => {
    expect(sharesSense({ meaning: 'fazer; construir' }, { meaning: 'fazer; consertar' })).toBe(false);
    expect(sharesSense({ meaning: 'odioso; detestável' }, { meaning: 'detestável (pessoa)' })).toBe(true);
    expect(sharesSense({ meaning: 'ódio' }, { meaning: 'Ódio' })).toBe(true);
  });
});

describe('alternativas do vocabulário', () => {
  it('nunca oferece como errada uma palavra que divide um sentido com a certa (amostra de 400)', () => {
    for (let i = 0; i < 400; i++) {
      const word = VOCAB[(i * 19) % VOCAB.length] as (typeof VOCAB)[number];
      for (const dir of ['jm', 'mj', 'au'] as const) {
        const options = buildVocabOptions(word, seeded(i + 1), dir);
        expect(options).toHaveLength(4);
        const wrong = options.filter((o) => o.char !== word.jp).map((o) => findWord(o.char) as (typeof VOCAB)[number]);
        for (const w of wrong) {
          expect(sharesSense(word, w)).toBe(false);
          if (dir === 'au') expect(w.reading).not.toBe(word.reading);
        }
      }
    }
  });

  it('no ouvido, um homófono não entra como alternativa errada', () => {
    const word = VOCAB.find((w) => isKanaOnly(w) && VOCAB.some((o) => o.id !== w.id && o.reading === w.reading && !sharesSense(w, o))) as (typeof VOCAB)[number];
    expect(word).toBeDefined();
    for (let i = 1; i <= 30; i++) {
      const readings = buildVocabOptions(word, seeded(i), 'au').map((o) => findWord(o.char)?.reading);
      expect(readings.filter((r) => r === word.reading)).toHaveLength(1);
    }
  });

  it('as perguntas de revisão passam a direção do cartão para as alternativas', () => {
    const word = VOCAB.find((w) => isKanaOnly(w)) as (typeof VOCAB)[number];
    const [q] = buildVocabQuestions([cardKey(word.id, 'au')], seeded(2));
    expect(q?.direction).toBe('audio');
    expect(q?.options).toHaveLength(4);
  });

  it('informa quantas alternativas vieram do grupo ou da escrita (pool reduzido tem menos de 3)', () => {
    const { options, preferred } = buildVocabOptionsDetailed(VOCAB[0] as (typeof VOCAB)[number], seeded(9));
    expect(options).toHaveLength(4);
    expect(preferred).toBeLessThanOrEqual(3);
  });
});

describe('auditoria do vocabulário', () => {
  const audit = auditVocab();

  it('toda palavra tem 3 alternativas válidas em algum lugar do vocabulário (sem fallback menor que 4)', () => {
    expect(audit.noPool).toEqual([]);
    expect(audit.total).toBe(VOCAB.length);
  });

  it('acha os sufixos e os homófonos', () => {
    expect(audit.affixes.length).toBeGreaterThan(0);
    expect(audit.affixes.every((w) => AFFIX.test(w.meaning))).toBe(true);
    expect(audit.homophones.length).toBeGreaterThan(0);
    expect(audit.homophones.every((g) => new Set(g.map((w) => w.jp)).size > 1)).toBe(true);
  });

  it('o relatório traz o resumo e as contagens', () => {
    const text = renderAudit(audit);
    expect(text).toContain('# Revisão do vocabulário');
    expect(text).toContain(`Palavras analisadas: **${audit.total}**`);
    expect(text).toContain(`Pool de alternativas reduzido`);
  });

  // `npm run audit-vocab` liga a variável e este teste grava o relatório em docs/.
  (process.env.VOCAB_AUDIT_WRITE === '1' ? it : it.skip)('grava docs/revisao-vocabulario.md', () => {
    fs.writeFileSync(path.join(__dirname, '../../../docs/revisao-vocabulario.md'), renderAudit(audit), 'utf8');
  });
});
