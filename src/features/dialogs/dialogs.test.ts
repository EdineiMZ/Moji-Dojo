import { DIALOG_SCENES } from '@/content/dialogs';
import { ALL_TRAVEL as TRAVEL_CATEGORIES } from '@/content/travel';
import { checkAnswer } from '@/features/translate/check';
import { correctOption, findScene, isYouTurn, nextYouIndex, optionLabel, shuffledOptions, visibleCount, writeTargets, youTurns } from './dialogs';

const TRAVEL_JP = new Set(TRAVEL_CATEGORIES.flatMap((c) => c.phrases.map((p) => p.jp)));

describe('as cenas', () => {
  it('têm id único e cada uma tem turnos do aluno', () => {
    expect(new Set(DIALOG_SCENES.map((s) => s.id)).size).toBe(DIALOG_SCENES.length);
    expect(DIALOG_SCENES.length).toBeGreaterThanOrEqual(4);
    for (const scene of DIALOG_SCENES) expect(youTurns(scene).length).toBeGreaterThanOrEqual(3);
  });

  it('cada turno do aluno tem uma só resposta certa, e as erradas explicam o motivo', () => {
    for (const scene of DIALOG_SCENES) {
      for (const turn of youTurns(scene)) {
        const jp = turn.options.map((o) => o.jp);
        expect({ scene: scene.id, ok: turn.options.filter((o) => o.ok).length }).toEqual({ scene: scene.id, ok: 1 });
        expect(new Set(jp).size).toBe(jp.length);
        expect(turn.options.length).toBeGreaterThanOrEqual(3);
        for (const o of turn.options.filter((x) => !x.ok)) expect((o.why ?? '').length).toBeGreaterThan(10);
      }
    }
  });

  it('as falas do aluno são frases de Viagem, com romaji e tradução', () => {
    for (const scene of DIALOG_SCENES) {
      for (const turn of youTurns(scene)) {
        for (const o of turn.options) {
          expect({ jp: o.jp, inTravel: TRAVEL_JP.has(o.jp) }).toEqual({ jp: o.jp, inTravel: true });
          expect(o.romaji.length).toBeGreaterThan(0);
          expect(o.pt.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('o aluno nunca fala duas vezes seguidas e o atendente tem tradução', () => {
    for (const scene of DIALOG_SCENES) {
      scene.turns.forEach((t, i) => {
        if (isYouTurn(t)) expect(isYouTurn(scene.turns[i - 1])).toBe(false);
        if (t.kind === 'staff') {
          expect(t.pt.length).toBeGreaterThan(0);
          expect(t.romaji.length).toBeGreaterThan(0);
        }
      });
    }
  });
});

describe('o andamento', () => {
  const scene = findScene('restaurante');
  if (!scene) throw new Error('cena não encontrada');

  it('acha o próximo turno do aluno e mostra a conversa até ele', () => {
    const first = nextYouIndex(scene, 0);
    expect(isYouTurn(scene.turns[first])).toBe(true);
    expect(visibleCount(scene, first)).toBe(first + 1);
    const second = nextYouIndex(scene, first + 1);
    expect(second).toBeGreaterThan(first);
    expect(nextYouIndex(scene, scene.turns.length)).toBe(-1);
    expect(visibleCount(scene, -1)).toBe(scene.turns.length);
  });

  it('as respostas embaralhadas são as mesmas, e o rótulo traz a ajuda pedida', () => {
    const turn = youTurns(scene)[0];
    if (!turn) throw new Error('sem turno');
    expect(shuffledOptions(turn).map((o) => o.jp).sort()).toEqual(turn.options.map((o) => o.jp).sort());
    const right = correctOption(turn);
    expect(optionLabel(right, 'none')).toBe(right.jp);
    expect(optionLabel(right, 'romaji')).toBe(`${right.jp}\n${right.romaji}`);
    expect(optionLabel(right, 'pt')).toBe(`${right.jp}\n${right.pt}`);
  });

  it('escrever as falas: cada alvo aceita a própria frase', () => {
    for (const s of DIALOG_SCENES) {
      const targets = writeTargets(s);
      expect(targets).toHaveLength(youTurns(s).length);
      for (const t of targets) expect(checkAnswer(t.answer, t.accepted).verdict).toBe('ok');
      // Uma mesma fala pode se repetir na cena (ex.: "obrigado"), mas cada alvo tem o seu id.
      expect(new Set(targets.map((t) => t.id)).size).toBe(targets.length);
    }
  });
});
