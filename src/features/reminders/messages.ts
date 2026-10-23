/**
 * Textos dos lembretes, na voz do Mochi: leves, variados e sem culpa. Nada de "você falhou" nem de ameaça: o tom é de
 * convite. Cada lista é escolhida por um número repetível (o dia), então o mesmo dia sempre tem o mesmo texto.
 */

export interface ReminderText {
  title: string;
  body: string;
}

export const DAILY_MESSAGES: readonly ReminderText[] = [
  { title: 'Mochi chamando 🌸', body: 'Que tal cinco minutinhos de japonês hoje?' },
  { title: 'Hora do dojo', body: 'Uma revisãozinha rápida e o dia já valeu a pena.' },
  { title: 'Oi! Sou eu, o Mochi', body: 'Trouxe uma palavra nova esperando por você.' },
  { title: 'Um pouquinho todo dia', body: 'Pouco tempo, muita diferença. Vamos?' },
  { title: 'もじどうじょう', body: 'Seu cantinho de japonês está pronto. Entre quando quiser.' },
  { title: 'Que tal uma frase hoje?', body: 'Escreva ou ouça uma frase e faça o Mochi sorrir.' },
  { title: 'O Mochi preparou um chá 🍵', body: 'Tome o seu e faça uma revisão tranquila.' },
  { title: 'Cinco minutos bastam', body: 'Abra o app, responda algumas perguntas e pronto.' },
  { title: 'Seu japonês agradece', body: 'Uma sessão curta ajuda a lembrar do que você já aprendeu.' },
  { title: 'Hora de brilhar ✨', body: 'Tem exercício novo esperando, do seu jeito e no seu ritmo.' },
  { title: 'Vamos ouvir um ditado?', body: 'Treine o ouvido hoje: ouça e escreva o que entendeu.' },
  { title: 'Mochi com saudade', body: 'Sem pressa: abra o app e dê só um oizinho para o japonês.' },
  { title: 'Que tal revisar kana?', body: 'Reler os kana de vez em quando faz eles grudarem na memória.' },
  { title: 'Um passinho de cada vez', body: 'Hoje, uma lição ou uma revisão. Escolha a sua.' },
  { title: 'Pétalas esperando 🌸', body: 'Estudar hoje rende pétalas para o armário do Mochi.' },
  { title: 'Missões do dia', body: 'Tem três missões novas. Dá para cumprir com calma.' },
  { title: 'Treino leve de hoje', body: 'Um exercício curto já conta como dia de estudo.' },
  { title: 'Japonês no bolso', body: 'Espere o ônibus, abra o app e responda umas perguntas.' },
  { title: 'Falar também vale', body: 'Diga uma frase em voz alta hoje. O Mochi está ouvindo.' },
  { title: 'Vamos manter o ritmo?', body: 'Constância ganha de pressa. Um pouquinho hoje já ajuda.' },
  { title: 'Palavra do dia', body: 'Aprenda uma palavra nova agora: leva menos de um minuto.' },
  { title: 'O dojo abriu', body: 'Entre, respire e faça o que der hoje.' },
  { title: 'Hora do Mochi', body: 'Um carinho no seu japonês: faça uma revisão rápida.' },
  { title: 'Seu futuro eu agradece', body: 'Estudar um pouco hoje facilita muito o amanhã.' },
  { title: 'Que tal um desafio?', body: 'Veja o desafio da semana e tente avançar um pouquinho.' },
  { title: 'Pausa para o japonês', body: 'Faça uma pausa de dois minutos para uma revisão.' },
  { title: 'Konnichiwa! 👋', body: 'Passando para lembrar do nosso treino de hoje.' },
  { title: 'Gramática sem susto', body: 'Um tópico curtinho hoje já deixa tudo mais claro.' },
  { title: 'Seu Mochi está esperando', body: 'Venha ver o que há de novo no armário e nas metas.' },
  { title: 'Vamos praticar?', body: 'Qualquer exercício conta. O importante é aparecer.' },
];

/** "Sua sequência de N dias..." — para quem tem uma sequência de pelo menos 3 dias e ainda não estudou hoje. */
export const STREAK_MESSAGES: readonly ((days: number) => ReminderText)[] = [
  (n) => ({ title: `${n} dias seguidos 🔥`, body: 'Que tal manter a sequência hoje? Uma revisão rápida já basta.' }),
  (n) => ({ title: 'O Mochi está de olho na sequência', body: `Já são ${n} dias de estudo. Vamos para o ${n + 1}?` }),
  (n) => ({ title: 'Sequência em dia?', body: `Você vem estudando há ${n} dias. Um exercício hoje mantém tudo certinho.` }),
  (n) => ({ title: `Dia ${n + 1} chegando 🌸`, body: 'Abra o app e continue a sua sequência com calma.' }),
];

/** Revisões esperando. */
export const DUE_MESSAGES: readonly ((count: number) => ReminderText)[] = [
  (n) => ({ title: 'Revisões esperando', body: `${n === 1 ? 'Há 1 item' : `Há ${n} itens`} para revisar. Dá para fazer em poucos minutos.` }),
  (n) => ({ title: 'Hora de relembrar', body: `${n === 1 ? '1 item está' : `${n} itens estão`} no ponto de ser revisado${n === 1 ? '' : 's'}.` }),
  (n) => ({ title: 'Seus cartões chegaram', body: `Revise ${n === 1 ? '1 cartão' : `${n} cartões`} e fixe o que você aprendeu.` }),
];

/** Para quem está há alguns dias sem estudar: acolhedor, sem cobrança. */
export const COMEBACK_MESSAGES: readonly ReminderText[] = [
  { title: 'Sem pressa, o Mochi espera', body: 'Quando der, volte com uma revisão leve. O resto volta aos poucos.' },
  { title: 'Saudades de você', body: 'Que tal só dez itens hoje? Retomar é mais fácil do que parece.' },
  { title: 'A porta do dojo está aberta', body: 'Você pode voltar quando quiser, do ponto onde parou.' },
  { title: 'Um recomeço tranquilo', body: 'Abra o app: ele vai propor uma revisão curtinha para você.' },
];

/** Aviso da noite: a sequência pode se perder se hoje passar sem estudo. */
export const RISK_MESSAGES: readonly ((days: number) => ReminderText)[] = [
  (n) => ({ title: `Sua sequência de ${n} dias`, body: 'Ainda dá tempo de estudar hoje. Uma revisão curta mantém tudo.' }),
  (n) => ({ title: 'Última chamada do dojo 🌙', body: `Hoje ainda não teve estudo. Salve o dia ${n + 1} com cinco minutinhos.` }),
  (n) => ({ title: 'Antes de dormir', body: `Que tal um exercício rápido? Seus ${n} dias seguidos agradecem.` }),
];

/** Número repetível a partir do dia, para escolher o mesmo texto sempre que o dia for o mesmo. */
export function seedOf(date: Date): number {
  return date.getFullYear() * 400 + date.getMonth() * 31 + date.getDate();
}

export const pick = <T>(list: readonly T[], seed: number): T => list[Math.abs(seed) % list.length] as T;

/** Começa a frase com o nome ("Ana, você...") ou, sem nome, com a primeira letra maiúscula ("Você..."). */
export function say(name: string, sentence: string): string {
  if (name) return `${name}, ${sentence}`;
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

/** Lembrete do horário escolhido, ligado à meta de minutos do dia. */
export const GOAL_DAILY_MESSAGES: readonly ((goal: number, name: string) => ReminderText)[] = [
  (goal, name) => ({ title: `Seus ${goal} minutos de hoje`, body: say(name, `hoje a meta é de ${goal} minutos de japonês. Vamos começar?`) }),
  (goal, name) => ({ title: 'Hora de treinar 🌸', body: say(name, `${goal} minutinhos de japonês e o dia está ganho.`) }),
  (goal, name) => ({ title: 'O dojo está aberto', body: say(name, `reserve ${goal} minutos para o japonês hoje. Pouco tempo, muita diferença.`) }),
];

/** Incentivo a aprender algo novo (no lugar de só revisar). */
export const NEW_THING_MESSAGES: readonly ((name: string) => ReminderText)[] = [
  (name) => ({ title: 'Não esqueça de aprender algo novo hoje!', body: say(name, 'uma lição ou cinco palavras novas já fazem a diferença.') }),
  (name) => ({ title: 'Algo novo hoje?', body: say(name, 'a trilha tem uma lição esperando por você.') }),
  (name) => ({ title: 'Uma palavra nova, só uma', body: say(name, 'aprenda uma palavra nova hoje: leva menos de um minuto.') }),
];

/** Aviso da noite de hoje, quando a meta de minutos ainda não foi batida: usa o que falta. */
export const GOAL_EVENING_TODAY: readonly ((goal: number, left: number, name: string) => ReminderText)[] = [
  (goal, left, name) => ({ title: 'Falta pouco 🌙', body: say(name, `você ainda não completou seus ${goal} minutos hoje! Faltam ${left} min.`) }),
  (goal, left, name) => ({ title: 'Ainda dá tempo', body: say(name, `faltam só ${left} min para a meta de ${goal} minutos de hoje.`) }),
  (goal, left, name) => ({ title: 'Última chamada do dojo', body: say(name, `a meta de ${goal} minutos ainda está aberta: faltam ${left} min.`) }),
];

/** Aviso da noite de amanhã (não se sabe ainda quanto será estudado): geral. */
export const GOAL_EVENING_GENERIC: readonly ((goal: number, name: string) => ReminderText)[] = [
  (goal, name) => ({ title: 'Não esqueça dos seus minutos', body: say(name, `lembre de separar ${goal} minutos para o japonês hoje.`) }),
  (goal, name) => ({ title: 'Meta de hoje', body: say(name, `${goal} minutos de japonês ainda esperam por você. Dá tempo!`) }),
];
