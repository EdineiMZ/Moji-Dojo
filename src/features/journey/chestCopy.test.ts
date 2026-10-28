import { dailyChestText } from './chestCopy';

describe('texto do baú do dia', () => {
  it('na primeira abertura dá as boas-vindas, sem dizer que a pessoa "voltou"', () => {
    expect(dailyChestText(true)).toMatch(/boas-vindas/i);
    expect(dailyChestText(true)).not.toMatch(/voltado/i);
  });

  it('nos dias seguintes agradece a volta', () => {
    expect(dailyChestText(false)).toMatch(/voltado hoje/);
  });
});
