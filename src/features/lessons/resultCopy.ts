import { requiredRatio } from './trail';

const percent = (ratio: number): number => Math.round(ratio * 100);

/** Texto acima do quiz da lição. */
export function testIntro(skipped: boolean): string {
  const need = percent(requiredRatio(skipped));
  return skipped
    ? `Teste para pular a lição: acerte ${need}% na primeira tentativa.`
    : `Passo final: acerte ${need}% na primeira tentativa. Cada caractere aparece dos dois jeitos (símbolo para som e som para símbolo). Se errar, a pergunta volta um pouco depois.`;
}

export interface ResultCopy {
  heading: string;
  body: string;
}

/** Textos da tela de resultado da lição. */
export function lessonResultCopy(passed: boolean, skipped: boolean): ResultCopy {
  if (passed) {
    return {
      heading: 'Lição concluída',
      body: 'Esses caracteres entraram nas suas revisões. Eles voltam no "Estudar hoje" amanhã e depois em 3, 7, 14 dias, cada vez mais espaçados enquanto você acertar.',
    };
  }
  return {
    heading: 'Quase lá',
    body: `Precisa de ${percent(requiredRatio(skipped))}%. Reveja os que errou e tente de novo. Errar agora é normal: é assim que a memória fixa.`,
  };
}

/** Humor do Mochi no resultado. */
export function resultMood(passed: boolean, pct: number): 'cheer' | 'neutral' | 'sad' {
  if (passed) return 'cheer';
  return pct >= 60 ? 'neutral' : 'sad';
}
