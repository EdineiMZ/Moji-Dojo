import { DAY_MS, type SrsState } from './srs';
import { EXTRA_REVIEW_SIZE, pickExtraReviewChars, reviewIntro, reviewTitle } from './session';

const NOW = new Date(2026, 9, 22, 10).getTime();
const entry = (b: number) => ({ b, due: NOW + b * DAY_MS });

describe('pickExtraReviewChars', () => {
  const srs: SrsState = {
    あ: entry(6),
    い: entry(1),
    う: entry(3),
    え: entry(1),
    お: entry(2),
  };

  it('escolhe os mais fracos primeiro (caixa mais baixa)', () => {
    const picked = pickExtraReviewChars(srs, () => true, () => 0.5, 3);
    expect(picked).toHaveLength(3);
    expect(picked.slice(0, 2).sort()).toEqual(['い', 'え']); // as duas da caixa 1
    expect(picked[2]).toBe('お'); // depois a da caixa 2
  });

  it('limita a 15 por padrão', () => {
    const many = Object.fromEntries(
      [...'あいうえおかきくけこさしすせそたちつてと'].map((c, i) => [c, entry((i % 6) + 1)]),
    );
    expect(pickExtraReviewChars(many)).toHaveLength(EXTRA_REVIEW_SIZE);
  });

  it('ignora caracteres desconhecidos e devolve vazio sem nada aprendido', () => {
    expect(pickExtraReviewChars(srs, (c) => c === 'あ')).toEqual(['あ']);
    expect(pickExtraReviewChars({})).toEqual([]);
  });

  it('o sorteio muda o desempate entre caixas iguais', () => {
    const seen = new Set<string>();
    for (const r of [0.01, 0.4, 0.99]) {
      seen.add(pickExtraReviewChars(srs, () => true, () => r, 1)[0] ?? '');
    }
    expect([...seen].every((c) => c === 'い' || c === 'え')).toBe(true);
  });
});

describe('textos', () => {
  it('título e introdução mudam entre revisão do dia e extra', () => {
    expect(reviewTitle(false)).toBe('Revisão do dia');
    expect(reviewTitle(true)).toBe('Revisão extra');
    expect(reviewIntro(true)).toContain('mais fracos');
    expect(reviewIntro(false)).toContain('volta amanhã');
  });
});
