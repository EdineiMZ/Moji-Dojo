import { CONVERSATION_WAYS, FIRST_CONVERSATION, IMMERSION } from './guide';

describe('guia de imersão', () => {
  it('cobre N5, N4 e N3, cada um com áudio, vídeo e leitura e uma regra de legendas', () => {
    expect(IMMERSION.map((p) => p.level)).toEqual(['n5', 'n4', 'n3']);
    for (const plan of IMMERSION) {
      expect(plan.steps.map((s) => s.kind)).toEqual(['Áudio', 'Vídeo', 'Leitura']);
      expect(plan.subtitles.length).toBeGreaterThan(40);
      for (const step of plan.steps) {
        expect(step.what.length).toBeGreaterThan(20);
        expect(step.examples.length).toBeGreaterThan(10);
      }
    }
  });

  it('o roteiro da primeira conversa tem abertura, perguntas, saída para travar e fechamento', () => {
    const titles = FIRST_CONVERSATION.map((t) => t.title).join(' | ');
    for (const part of ['Abertura', 'Perguntas', 'travar', 'Fechamento']) expect(titles).toContain(part);
  });

  it('os conselhos de conversa avisam sobre segurança', () => {
    expect(CONVERSATION_WAYS.some((t) => t.title === 'Segurança')).toBe(true);
  });

  it('não repete título dentro do mesmo grupo', () => {
    for (const list of [CONVERSATION_WAYS, FIRST_CONVERSATION]) expect(new Set(list.map((t) => t.title)).size).toBe(list.length);
  });
});
