import { ALL_EXERCISES } from '@/content/grammar';
import { BUILD_EXERCISES } from '@/data/exercises';
import type { BuildExercise } from '@/data/types';
import { closestAnswer, diagnose, otherValid } from './diagnose';
import { buildJudgeQuestion, buildJudgeRound } from './judge';

const find = (pt: string): BuildExercise => {
  const e = BUILD_EXERCISES.find((x) => x.pt === pt);
  if (!e) throw new Error(`exercício não encontrado: ${pt}`);
  return e;
};

const rng = () => 0.31;

describe('diagnose', () => {
  const sushi = find('Quero comer sushi.');

  it('montagem certa não tem o que explicar', () => {
    expect(diagnose(sushi, sushi.answer)).toEqual([]);
  });

  it('partícula trocada: diz o que cada uma faz', () => {
    const lines = diagnose(sushi, ['すし', 'に', 'たべたいです']);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('Você usou に no lugar de を');
    expect(lines[0]).toContain('objeto');
  });

  it('partícula que sobra e partícula que falta', () => {
    expect(diagnose(sushi, ['すし', 'を', 'たべたいです', 'に'])[0]).toContain('A partícula に sobra');
    expect(diagnose(sushi, ['すし', 'たべたいです'])[0]).toContain('Falta a partícula を');
  });

  it('só a ordem errada: avisa do verbo no fim', () => {
    const lines = diagnose(sushi, ['たべたいです', 'すし', 'を']);
    expect(lines[0]).toContain('a ordem não');
    expect(lines.join(' ')).toContain('por último');
  });

  it('partícula antes da palavra: avisa que ela vem depois', () => {
    const lines = diagnose(sushi, ['を', 'すし', 'たべたいです']);
    expect(lines.join(' ')).toContain('A partícula を vem logo depois');
  });

  it('final da frase trocado: diz o que cada forma significa', () => {
    const e: BuildExercise = { topic: 't', pt: 'x', answer: ['すし', 'を', 'たべます'], extra: ['たべません'], romaji: '', hint: '' };
    const line = diagnose(e, ['すし', 'を', 'たべません'])[0] ?? '';
    expect(line).toContain('Você usou たべません no lugar de たべます');
    expect(line).toContain('negativo');
  });

  it('compara com a ordem alternativa mais parecida', () => {
    const beer = find('Ontem eu bebi cerveja.');
    expect(closestAnswer(beer, ['ビール', 'を', 'きのう', 'のみました'])).toEqual(['ビール', 'を', 'きのう', 'のみました']);
    expect(diagnose(beer, ['ビール', 'を', 'きのう', 'のみました'])).toEqual([]);
    expect(diagnose(beer, ['ビール', 'に', 'きのう', 'のみました'])[0]).toContain('Você usou に no lugar de を');
  });

  it('otherValid lista as outras respostas, sem a montada', () => {
    const beer = find('Ontem eu bebi cerveja.');
    expect(otherValid(beer, beer.answer)).toHaveLength((beer.alternatives ?? []).length);
    expect(otherValid(sushi, sushi.answer)).toEqual(['すし が たべたいです']);
    expect(otherValid(sushi, ['すし', 'が', 'たべたいです'])).toEqual(['すし を たべたいです']);
  });

  it('toda resposta errada de todos os exercícios recebe uma explicação', () => {
    for (const e of ALL_EXERCISES) {
      const wrong = [...e.answer].reverse();
      if (wrong.join('|') === e.answer.join('|')) continue;
      if ((e.alternatives ?? []).some((a) => a.join('|') === wrong.join('|'))) continue;
      expect({ pt: e.pt, lines: diagnose(e, wrong).length > 0 }).toEqual({ pt: e.pt, lines: true });
    }
  });
});

describe('qual está certa?', () => {
  const sushi = find('Quero comer sushi.');

  it('a pergunta tem a frase certa e as erradas, e cada errada diz o que mudou', () => {
    const q = buildJudgeQuestion(sushi, rng);
    expect(q).not.toBeNull();
    if (!q || q.item.script !== 'pair') throw new Error('esperava um par');
    const texts = q.options.map((o) => o.char);
    expect(texts).toContain('すし を たべたいです');
    expect(texts.length).toBeGreaterThanOrEqual(2);
    expect(new Set(texts).size).toBe(texts.length);
    for (const wrong of texts.filter((t) => t !== q.item.char)) {
      expect(q.item.whyWrong?.[wrong]).toBeTruthy();
    }
  });

  it('nenhuma alternativa errada é, na verdade, uma resposta aceita', () => {
    for (const e of ALL_EXERCISES) {
      const q = buildJudgeQuestion(e, rng);
      if (!q) continue;
      const accepted = new Set([e.answer, ...(e.alternatives ?? [])].map((a) => a.join(' ')));
      const accepts = q.options.filter((o) => accepted.has(o.char));
      expect({ pt: e.pt, certas: accepts.length }).toEqual({ pt: e.pt, certas: 1 });
    }
  });

  it('nunca troca は, が ou も, que podem estar certas', () => {
    for (const e of ALL_EXERCISES) {
      const q = buildJudgeQuestion(e, rng);
      if (!q) continue;
      for (const o of q.options) {
        const tokens = o.char.split(' ');
        const soft = (t: readonly string[]) => t.filter((x) => ['は', 'が', 'も'].includes(x)).join('');
        expect({ pt: e.pt, soft: soft(tokens) }).toEqual({ pt: e.pt, soft: soft(e.answer) });
      }
    }
  });

  it('a rodada traz o número pedido de perguntas, de frases diferentes', () => {
    const round = buildJudgeRound('all', Math.random, 8);
    expect(round).toHaveLength(8);
    expect(new Set(round.map((q) => q.item.char)).size).toBe(8);
  });
});
