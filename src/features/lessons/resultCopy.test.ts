import { lessonResultCopy, resultMood, testIntro } from './resultCopy';

describe('testIntro', () => {
  it('lição normal pede 80%; "Já sei" pede 90%', () => {
    expect(testIntro(false)).toContain('80%');
    expect(testIntro(true)).toContain('90%');
  });
});

describe('lessonResultCopy', () => {
  it('passou: conclui e fala das revisões', () => {
    const copy = lessonResultCopy(true, false);
    expect(copy.heading).toBe('Lição concluída');
    expect(copy.body).toContain('revisões');
  });

  it('não passou: diz quanto era preciso', () => {
    expect(lessonResultCopy(false, false).body).toContain('Precisa de 80%');
    expect(lessonResultCopy(false, true).body).toContain('Precisa de 90%');
  });
});

describe('resultMood', () => {
  it('comemora ao passar; senão neutro a partir de 60%, triste abaixo', () => {
    expect(resultMood(true, 80)).toBe('cheer');
    expect(resultMood(false, 70)).toBe('neutral');
    expect(resultMood(false, 40)).toBe('sad');
  });
});
