import { BUILD_EXERCISES } from '@/data/exercises';
import { acceptedAt, allBlanks, blankOptions, buildClozeQuestion, buildClozeRound, promptFor } from './cloze';

const find = (pt: string) => {
  const exercise = BUILD_EXERCISES.find((e) => e.pt === pt);
  if (!exercise) throw new Error(pt);
  return exercise;
};

describe('lacunas', () => {
  it('toda lacuna tem a resposta certa e 1 a 3 erradas, sem repetir', () => {
    for (const blank of allBlanks()) {
      const options = blankOptions(blank);
      expect(options.length).toBeGreaterThanOrEqual(2);
      expect(options.length).toBeLessThanOrEqual(4);
      expect(new Set(options).size).toBe(options.length);
      expect(options).toContain(blank.exercise.answer[blank.index]);
    }
  });

  it('nenhuma alternativa errada é uma resposta também aceita (に/へ)', () => {
    const exercise = find('Vou para o Japão.');
    const index = exercise.answer.indexOf('に');
    expect([...acceptedAt(exercise, index)].sort()).toEqual(['に', 'へ'].sort());
    for (let i = 0; i < 30; i++) {
      const options = blankOptions({ exercise, index, kind: 'particle' });
      expect(options).not.toContain('へ');
    }
  });

  it('を e が valem em "Quero comer sushi"', () => {
    const exercise = find('Quero comer sushi.');
    const index = exercise.answer.indexOf('を');
    expect(acceptedAt(exercise, index).has('が')).toBe(true);
    expect(blankOptions({ exercise, index, kind: 'particle' })).not.toContain('が');
  });

  it('só pergunta a forma do final quando há um erro plausível', () => {
    const forms = allBlanks().filter((b) => b.kind === 'form');
    expect(forms.length).toBeGreaterThan(3);
    // これ não é uma forma errada de おいしいです.
    expect(forms.some((b) => b.exercise.pt === 'Este lámen é gostoso.')).toBe(false);
  });

  it('a pergunta mostra o espaço e a tradução, e explica com a frase inteira', () => {
    const exercise = find('Eu como lámen.');
    const blank = { exercise, index: exercise.answer.indexOf('を'), kind: 'particle' } as const;
    expect(promptFor(blank)).toBe('わたし は ラーメン ＿＿ たべます\n(Eu como lámen.)');
    const q = buildClozeQuestion(blank);
    expect(q.item.char).toBe('を');
    expect(q.item.script === 'pair' && q.item.explain).toContain('わたしはラーメンをたべます');
    expect(q.item.script === 'pair' && q.item.hint).toBe(exercise.hint);
  });

  it('a rodada respeita o tipo, o limite e prefere frases diferentes', () => {
    const round = buildClozeRound('particle', Math.random, 10);
    expect(round).toHaveLength(10);
    const labels = round.map((q) => q.item.label);
    expect(new Set(labels).size).toBe(10);
    expect(buildClozeRound('form', Math.random, 50).length).toBe(allBlanks().filter((b) => b.kind === 'form').length);
  });
});
