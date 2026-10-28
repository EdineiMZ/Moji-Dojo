/** O texto do baú do dia: na primeira abertura não há "volta" nenhuma, então é uma boas-vindas. */
export const dailyChestText = (firstDay: boolean): string =>
  firstDay ? 'Boas-vindas! Um presente do Mochi para começar os estudos. O que será que veio?' : 'Um presente do Mochi por você ter voltado hoje. O que será que veio?';
