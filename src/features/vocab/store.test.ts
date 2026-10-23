import { VOCAB } from '@/content';
import { createProgressStore } from '@/store/progressStore';
import { APP_BACKUP_PREFIX, exportBackup, parseBackup } from '@/features/backup/backup';
import { describeCounts } from '@/features/backup/describe';
import { DAY_MS } from '@/features/review/srs';
import { cardKey, cardKeysFor, dueCards, isKanaOnly } from './cards';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

const NOW = new Date(2026, 9, 22, 12).getTime();
const kana = VOCAB.find((w) => isKanaOnly(w)) as (typeof VOCAB)[number];
const kanji = VOCAB.find((w) => !isKanaOnly(w)) as (typeof VOCAB)[number];

describe('learnWords e recordVocabAnswer', () => {
  it('aprender cria os cartões já vencidos (dá para praticar na hora) e marca o dia', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().learnWords([kana.id, kanji.id], NOW);
    const { vocab, days } = store.getState();
    expect(Object.keys(vocab).sort()).toEqual([...cardKeysFor(kana), ...cardKeysFor(kanji)].sort());
    expect(Object.values(vocab).every((e) => e.b === 1 && e.due === NOW)).toBe(true);
    expect(dueCards(vocab, NOW)).toHaveLength(5); // 3 da palavra de kana + 2 da de kanji
    expect(days).toHaveLength(1);
  });

  it('aprender de novo não mexe em cartões que já têm progresso; id desconhecido é ignorado', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().learnWords([kana.id], NOW);
    store.getState().recordVocabAnswer(cardKey(kana.id, 'jm'), true, true, NOW);
    const before = store.getState().vocab;
    store.getState().learnWords([kana.id, 'palavra que não existe'], NOW + DAY_MS);
    expect(store.getState().vocab).toEqual(before);
  });

  it('acertar de primeira sobe a caixa e agenda; errar volta à caixa 1 vencido agora; acerto depois de erro volta amanhã', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().learnWords([kana.id], NOW);
    const key = cardKey(kana.id, 'jm');

    store.getState().recordVocabAnswer(key, true, true, NOW);
    expect(store.getState().vocab[key]).toEqual({ b: 2, due: NOW + 3 * DAY_MS });

    store.getState().recordVocabAnswer(key, false, true, NOW);
    expect(store.getState().vocab[key]).toEqual({ b: 1, due: NOW });

    store.getState().recordVocabAnswer(key, true, false, NOW);
    expect(store.getState().vocab[key]).toEqual({ b: 1, due: NOW + DAY_MS });
  });

  it('conta como atividade do dia (respostas e acertos), sem inflar os caracteres aprendidos', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().learnWords([kana.id], NOW);
    store.getState().recordVocabAnswer(cardKey(kana.id, 'jm'), true, true, NOW);
    store.getState().recordVocabAnswer(cardKey(kana.id, 'mj'), false, true, NOW);
    const day = Object.values(store.getState().history)[0];
    expect(day).toEqual({ answers: 2, correct: 1, learned: 0 });
  });

  it('responder um cartão que não existe só marca o dia (não cria cartão)', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().recordVocabAnswer(cardKey(kana.id, 'jm'), true, true, NOW);
    expect(store.getState().vocab).toEqual({});
  });

  it('zerar o progresso apaga o vocabulário', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().learnWords([kana.id], NOW);
    store.getState().resetProgress();
    expect(store.getState().vocab).toEqual({});
  });

  it('o vocabulário é salvo e volta ao reabrir o app', () => {
    const storage = memoryStorage();
    const a = createProgressStore(storage);
    a.getState().learnWords([kana.id], NOW);
    expect(createProgressStore(storage).getState().vocab).toEqual(a.getState().vocab);
  });
});

describe('vocabulário no backup (MDJ1)', () => {
  const mdj = (payload: unknown) => APP_BACKUP_PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

  it('exporta e importa o vocabulário, e o resumo conta as palavras', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().learnWords([kana.id, kanji.id], NOW);
    store.getState().markStudied(NOW);
    const result = parseBackup(exportBackup(store.getState(), new Date(NOW)));
    if (!result.ok) throw new Error(`esperava sucesso, veio ${result.error}`);
    expect(result.extras?.vocab).toEqual(store.getState().vocab);
    expect(result.summary.words).toBe(2);
    expect(describeCounts(result.summary)).toContain('2 palavras de vocabulário');
  });

  it('descarta cartões de palavras que não existem, direção inválida e valores quebrados', () => {
    const result = parseBackup(
      mdj({
        v: 1,
        days: ['2026-10-22'],
        vocab: {
          [cardKey(kana.id, 'au')]: { b: 99, due: 5 }, // válido: a caixa é limitada a 6
          [`${kanji.id}|au`]: { b: 1, due: 5 }, // áudio não vale para palavra com kanji
          'palavra que não existe|jm': { b: 1, due: 5 },
          [cardKey(kana.id, 'jm')]: { b: 'x', due: 5 },
          [cardKey(kana.id, 'mj')]: 'quebrado',
        },
      }),
    );
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.extras?.vocab).toEqual({ [cardKey(kana.id, 'au')]: { b: 6, due: 5 } });
    expect(result.summary.ignored).toBe(4);
  });

  it('um código MDJ1 antigo, sem o campo vocab, continua valendo (vocabulário vazio)', () => {
    const result = parseBackup(mdj({ v: 1, days: ['2026-10-22'] }));
    if (!result.ok) throw new Error('esperava sucesso');
    expect(result.extras?.vocab).toEqual({});
    expect(result.summary.words).toBe(0);
  });

  it('importar um backup do app troca o vocabulário; do protótipo (NDJ1) preserva o que existe', () => {
    const store = createProgressStore(memoryStorage());
    store.getState().learnWords([kana.id], NOW);
    store.getState().replaceProgress({ srs: {}, lessons: {}, stats: {}, days: [] }); // sem extras = protótipo
    expect(Object.keys(store.getState().vocab)).toHaveLength(3);
    store.getState().replaceProgress({ srs: {}, lessons: {}, stats: {}, days: [] }, { history: {}, shadow: {}, challenges: {}, vocab: {}, conj: {} });
    expect(store.getState().vocab).toEqual({});
  });
});
