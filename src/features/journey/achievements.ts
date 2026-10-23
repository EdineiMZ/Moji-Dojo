/** Conquistas. Cada uma tem um teste sobre o contexto atual; as que dão item aparecem em `items.ts` (fonte "achievement"). */

export interface AchievementContext {
  streak: number;
  bestStreak: number;
  wordsLearned: number;
  topicsMastered: number;
  hiraDone: boolean;
  kataDone: boolean;
  phrasesCount: number;
  level: number;
  itemsOwned: number;
  weeksWon: number;
  bestPerfectRun: number;
  /** Hora local (0 a 23) do momento do evento. */
  hour: number;
  counters: Readonly<Record<string, number>>;
}

export interface Achievement {
  id: string;
  title: string;
  text: string;
  /** Escondida na estante até ser ganha. */
  hidden?: boolean;
  /** Pétalas de presente (além do item, se houver). */
  petals: number;
  test: (c: AchievementContext) => boolean;
  /** Progresso para mostrar na estante: [atual, meta]. */
  progress?: (c: AchievementContext) => readonly [number, number];
}

const counter = (c: AchievementContext, key: string): number => c.counters[key] ?? 0;

const atLeast = (id: string, title: string, text: string, petals: number, read: (c: AchievementContext) => number, goal: number, hidden = false): Achievement => ({
  id,
  title,
  text,
  petals,
  ...(hidden ? { hidden } : {}),
  test: (c) => read(c) >= goal,
  progress: (c) => [Math.min(read(c), goal), goal],
});

export const ACHIEVEMENTS: readonly Achievement[] = [
  // Sequência
  atLeast('streak-3', 'Pegando o ritmo', 'Estude 3 dias seguidos.', 10, (c) => c.bestStreak, 3),
  atLeast('streak-7', 'Uma semana inteira', 'Estude 7 dias seguidos.', 30, (c) => c.bestStreak, 7),
  atLeast('streak-14', 'Duas semanas', 'Estude 14 dias seguidos.', 50, (c) => c.bestStreak, 14),
  atLeast('streak-30', 'Um mês de dojo', 'Estude 30 dias seguidos.', 100, (c) => c.bestStreak, 30),
  atLeast('streak-100', 'Cem dias', 'Estude 100 dias seguidos.', 300, (c) => c.bestStreak, 100),
  atLeast('streak-365', 'Um ano com o Mochi', 'Estude 365 dias seguidos.', 1000, (c) => c.bestStreak, 365),
  // Palavras e gramática
  atLeast('words-25', 'Primeiras palavras', 'Aprenda 25 palavras.', 15, (c) => c.wordsLearned, 25),
  atLeast('words-100', 'Cem palavras', 'Aprenda 100 palavras.', 60, (c) => c.wordsLearned, 100),
  atLeast('words-300', 'Trezentas palavras', 'Aprenda 300 palavras.', 120, (c) => c.wordsLearned, 300),
  atLeast('words-600', 'Vocabulário de viagem', 'Aprenda 600 palavras.', 250, (c) => c.wordsLearned, 600),
  atLeast('topics-1', 'Primeiro tópico', 'Domine um tópico de gramática.', 15, (c) => c.topicsMastered, 1),
  atLeast('topics-10', 'Gramática em dia', 'Domine 10 tópicos de gramática.', 80, (c) => c.topicsMastered, 10),
  atLeast('topics-25', 'Quase um livro', 'Domine 25 tópicos de gramática.', 200, (c) => c.topicsMastered, 25),
  // Escrita
  {
    id: 'hira-all',
    title: 'Hiragana completo',
    text: 'Conclua todas as lições de hiragana.',
    petals: 100,
    test: (c) => c.hiraDone,
  },
  {
    id: 'kata-all',
    title: 'Katakana completo',
    text: 'Conclua todas as lições de katakana.',
    petals: 100,
    test: (c) => c.kataDone,
  },
  // Lições e acertos
  atLeast('lessons-1', 'Primeira lição', 'Conclua uma lição.', 10, (c) => counter(c, 'lessons'), 1),
  atLeast('lessons-10', 'Dez lições', 'Conclua 10 lições.', 40, (c) => counter(c, 'lessons'), 10),
  atLeast('lessons-50', 'Cinquenta lições', 'Conclua 50 lições.', 150, (c) => counter(c, 'lessons'), 50),
  atLeast('perfect-1', 'Sem errar', 'Conclua uma lição sem errar nada.', 15, (c) => counter(c, 'perfectLessons'), 1),
  atLeast('perfect-run-5', 'Cinco perfeitas', 'Conclua 5 lições perfeitas seguidas.', 50, (c) => c.bestPerfectRun, 5),
  atLeast('perfect-run-10', 'Dez perfeitas', 'Conclua 10 lições perfeitas seguidas.', 120, (c) => c.bestPerfectRun, 10),
  atLeast('correct-100', 'Cem acertos', 'Acerte 100 respostas.', 20, (c) => counter(c, 'correct'), 100),
  atLeast('correct-1000', 'Mil acertos', 'Acerte 1.000 respostas.', 150, (c) => counter(c, 'correct'), 1000),
  atLeast('correct-5000', 'Cinco mil acertos', 'Acerte 5.000 respostas.', 500, (c) => counter(c, 'correct'), 5000),
  // Ouvir, falar, escrever
  atLeast('dictations-10', 'Ouvido afiado', 'Faça 10 ditados.', 50, (c) => counter(c, 'dictations'), 10),
  atLeast('speak-10', 'Falando alto', 'Diga 10 frases em voz alta.', 50, (c) => counter(c, 'speaks'), 10),
  atLeast('recordings-1', 'Sua voz', 'Grave a sua voz pela primeira vez.', 20, (c) => counter(c, 'recordings'), 1),
  atLeast('phrases-1', 'Minha primeira frase', 'Escreva uma frase sua.', 15, (c) => c.phrasesCount, 1),
  atLeast('phrases-20', 'Escritor', 'Tenha 20 frases suas.', 100, (c) => c.phrasesCount, 20),
  atLeast('dialog-perfect', 'Conversa perfeita', 'Termine uma cena de diálogo sem errar.', 40, (c) => counter(c, 'dialogsPerfect'), 1),
  // Hábito
  atLeast('weeks-1', 'Primeira semana cumprida', 'Cumpra a meta semanal.', 30, (c) => c.weeksWon, 1),
  atLeast('weeks-5', 'Cinco semanas', 'Cumpra a meta semanal 5 vezes.', 100, (c) => c.weeksWon, 5),
  atLeast('weeks-10', 'Dez semanas', 'Cumpra a meta semanal 10 vezes.', 200, (c) => c.weeksWon, 10),
  atLeast('rescue-1', 'Sequência salva', 'Salve a sua sequência com uma revisão.', 20, (c) => counter(c, 'rescues'), 1),
  atLeast('comeback', 'De volta ao dojo', 'Volte a estudar depois de uma pausa.', 20, (c) => counter(c, 'comebacks'), 1, true),
  // Mochi e nível
  atLeast('shop-1', 'Primeira compra', 'Compre um item na loja.', 10, (c) => counter(c, 'purchases'), 1),
  atLeast('items-10', 'Guarda-roupa', 'Tenha 10 itens do Mochi.', 60, (c) => c.itemsOwned, 10),
  atLeast('items-25', 'Colecionador', 'Tenha 25 itens do Mochi.', 200, (c) => c.itemsOwned, 25),
  atLeast('level-5', 'Nível 5', 'Chegue ao nível 5.', 50, (c) => c.level, 5),
  atLeast('level-10', 'Nível 10', 'Chegue ao nível 10.', 150, (c) => c.level, 10),
  // Escondidas
  {
    id: 'early-bird',
    title: 'Madrugador',
    text: 'Estude antes das 7 da manhã.',
    hidden: true,
    petals: 20,
    test: (c) => counter(c, 'earlyBird') >= 1,
  },
  {
    id: 'night-owl',
    title: 'Coruja',
    text: 'Estude depois da meia-noite.',
    hidden: true,
    petals: 20,
    test: (c) => counter(c, 'nightOwl') >= 1,
  },
];

const BY_ID: ReadonlyMap<string, Achievement> = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));

export const findAchievement = (id: string): Achievement | undefined => BY_ID.get(id);

/** Conquistas cujo teste passa e que ainda não foram ganhas. */
export const newlyEarned = (context: AchievementContext, earned: Readonly<Record<string, number>>): Achievement[] =>
  ACHIEVEMENTS.filter((a) => earned[a.id] === undefined && a.test(context));
