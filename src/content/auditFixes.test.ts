import { ALL_GRAMMAR } from './grammar';
import { SOUND_TOPICS } from '@/data/sounds';

const text = (t: (typeof ALL_GRAMMAR)[number]): string =>
  t.body.map((b) => ('runs' in b ? b.runs.map((r) => r.text).join('') : '')).join(' ');
const topic = (id: string) => ALL_GRAMMAR.find((t) => t.id === id) as (typeof ALL_GRAMMAR)[number];

describe('correções de texto da auditoria', () => {
  it('g1: です é "é"/"sou"; "está" só para estado, e lugar remete ao tópico 7', () => {
    const g1 = text(topic('g1'));
    expect(g1).toContain('"é" ou "sou"');
    expect(g1).toContain('só para um estado');
    expect(g1).toContain('あります e います');
  });

  it('g9: avisa que きれい termina em い mas é do tipo な', () => {
    expect(text(topic('g9'))).toMatch(/きれい.*termina em.*い.*tipo.*な/s);
  });

  it('o exemplo do R japonês escreve ラーメン (a escrita normal), não らーめん', () => {
    const examples = SOUND_TOPICS.flatMap((t) => t.examples.map((e) => e.jp));
    expect(examples).toContain('ラーメン');
    expect(examples).not.toContain('らーめん');
  });

  it('as traduções do Tatoeba escolhidas são as em português do Brasil (nenhuma das marcas de Portugal)', () => {
    const pt = ALL_GRAMMAR.flatMap((t) => t.examples.map((e) => e.pt));
    for (const bad of ['Não te preocupes.', 'Não podes estar a falar a sério.', 'Comamos enquanto esteja quente.', 'Vou ir ao cinema.']) {
      expect(pt).not.toContain(bad);
    }
    for (const good of ['Não se preocupe.', 'Planejo ir ao cinema.', 'Você não pode estar falando sério.', 'Vamos comer enquanto a comida está quente.']) {
      expect(pt).toContain(good);
    }
  });

  it('a ordem do N5: が (g39) logo depois dos 10 iniciais e a forma simples (g40) antes do 〜ないでください (g16)', () => {
    const ids = ALL_GRAMMAR.map((t) => t.id);
    expect(ids.slice(0, 11)).toEqual(['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g39']);
    expect(ids.indexOf('g40')).toBeLessThan(ids.indexOf('g16'));
    expect(ids.indexOf('g40')).toBeGreaterThan(ids.indexOf('g15'));
  });
});
