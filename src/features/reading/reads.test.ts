import { READINGS } from '@/content/readings';
import { levelPaths } from '@/features/journey/milestones';
import { sanitizeReads } from './reads';

describe('textos lidos', () => {
  const real = READINGS.find((t) => t.level === 'N4')!.id;

  it('guarda só ids de textos que existem, com um momento válido', () => {
    expect(sanitizeReads({ [real]: 1_800_000_000_000, 'texto-que-nao-existe': 5, [READINGS[0]!.id]: -3, x: 'a' })).toEqual({ [real]: 1_800_000_000_000 });
    expect(sanitizeReads(null)).toEqual({});
    expect(sanitizeReads([1, 2])).toEqual({});
  });

  it('o marco de leitura de cada nível conta os textos lidos daquele nível', () => {
    const n4 = READINGS.filter((t) => t.level === 'N4');
    const paths = levelPaths({}, {}, {}, {}, { [real]: 1 });
    const milestone = paths.find((p) => p.level === 'N4')?.milestones.find((m) => m.id === 'reading4');
    expect(milestone).toMatchObject({ have: 1, goal: n4.length });
    const n5 = paths.find((p) => p.level === 'N5')?.milestones.find((m) => m.id === 'reading5');
    expect(n5?.have).toBe(0);
    expect(n5?.goal).toBe(READINGS.length - n4.length);
  });
});
