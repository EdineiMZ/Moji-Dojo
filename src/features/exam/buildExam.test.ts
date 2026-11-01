import { buildExam, EXAM_LEVELS, EXAM_SECTIONS, scoreBySection, type ExamLevel } from './buildExam';

/** Sorteio repetível para o teste não depender da sorte. */
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

describe('simulado offline', () => {
  it.each(EXAM_LEVELS)('o %s tem as seções que o nível já tem, com perguntas bem formadas', (level: ExamLevel) => {
    const exam = buildExam(level, 5, seeded(7));
    // O N2 e o N1 ainda só têm vocabulário (e a leitura das palavras): sem kanji nem gramática próprios.
    const sections = EXAM_SECTIONS.filter(({ id }) => (level !== 'N2' && level !== 'N1') || id === 'vocab' || id === 'reading');
    expect(exam).toHaveLength(sections.length * 5);
    for (const { id } of sections) expect(exam.filter((q) => q.section === id)).toHaveLength(5);
    for (const q of exam) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(4);
      expect(q.prompt).toMatch(/「.+」/);
      expect(q.explanation.length).toBeGreaterThan(5);
      // A explicação cita a alternativa certa (o gabarito não pode contradizer o índice).
      expect(q.explanation).toContain(q.options[q.answer]?.replace(/\.$/, '') ?? '###');
    }
  });

  it('o N4 só pergunta o conteúdo do N4 e o N5, o do N5', () => {
    const n4 = buildExam('N4', 10, seeded(3));
    const n5 = buildExam('N5', 10, seeded(3));
    expect(n4.filter((q) => q.section === 'grammar').every((q) => /Tópico: .+/.test(q.explanation))).toBe(true);
    // Sem perguntas repetidas dentro de uma prova.
    expect(new Set(n4.map((q) => q.prompt)).size).toBe(n4.length);
    expect(new Set(n5.map((q) => q.prompt)).size).toBe(n5.length);
    // As duas provas não se misturam: nenhuma pergunta aparece nas duas.
    const n5prompts = new Set(n5.map((q) => q.prompt));
    expect(n4.some((q) => n5prompts.has(q.prompt))).toBe(false);
  });

  it('provas diferentes a cada sorteio', () => {
    const a = buildExam('N4', 5, seeded(1)).map((q) => q.prompt).join('|');
    const b = buildExam('N4', 5, seeded(2)).map((q) => q.prompt).join('|');
    expect(a).not.toBe(b);
  });

  it('a nota é calculada por seção, na ordem da prova', () => {
    const exam = buildExam('N5', 5, seeded(5));
    const results = exam.map((q) => q.section !== 'kanji');
    const scores = scoreBySection(exam, results);
    expect(scores.map((s) => s.section)).toEqual(['vocab', 'reading', 'kanji', 'grammar']);
    expect(scores.find((s) => s.section === 'kanji')).toMatchObject({ correct: 0, total: 5, pct: 0 });
    expect(scores.find((s) => s.section === 'vocab')).toMatchObject({ correct: 5, total: 5, pct: 100 });
  });
});
