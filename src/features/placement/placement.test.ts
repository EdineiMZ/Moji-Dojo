import { buildPlacement, placeKnown, placementResult, PLACEMENT_KANA, PLACEMENT_WORDS } from './placement';

const NOW = 1_000_000;
describe('teste de nivelamento', () => {
  it('traz kana e palavras, cada pergunta com 4 alternativas', () => {
    const questions = buildPlacement();
    expect(questions).toHaveLength(PLACEMENT_KANA + PLACEMENT_WORDS);
    expect(questions.every((q) => q.options.length === 4)).toBe(true);
  });

  it('só o que foi acertado de primeira conta como sabido', () => {
    const questions = buildPlacement();
    const answers = questions.map((question, i) => ({ question, firstTryRight: i % 2 === 0 }));
    const result = placementResult(answers);
    expect(result.asked).toEqual({ kana: PLACEMENT_KANA, words: PLACEMENT_WORDS });
    expect(result.kana.length + result.words.length).toBe(Math.ceil(answers.length / 2));
  });

  it('coloca na caixa 3 sem rebaixar quem já estava mais alto e sem perder as outras marcas', () => {
    const next = placeKnown({ あ: { b: 5, due: 1 }, い: { b: 1, due: 2, l: 2 } }, ['あ', 'い', 'う'], NOW);
    expect(next['あ']).toEqual({ b: 5, due: 1 });
    expect(next['い']).toMatchObject({ b: 3, l: 2 });
    expect(next['う']?.b).toBe(3);
    expect(next['う']?.due).toBeGreaterThan(NOW);
  });
});
