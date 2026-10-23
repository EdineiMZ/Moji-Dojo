import { FLOOR_DB, levelHeight, waveformBars } from './waveform';

describe('levelHeight', () => {
  it('0 dB é altura cheia, o piso e abaixo é zero, e valores estranhos viram zero', () => {
    expect(levelHeight(0)).toBe(1);
    expect(levelHeight(FLOOR_DB)).toBe(0);
    expect(levelHeight(-160)).toBe(0);
    expect(levelHeight(10)).toBe(1);
    expect(levelHeight(-30)).toBeCloseTo(0.5);
    expect(levelHeight(Number.NaN)).toBe(0);
  });
});

describe('waveformBars', () => {
  it('sem leituras, sem barras', () => {
    expect(waveformBars([], 40)).toEqual([]);
    expect(waveformBars([-10], 0)).toEqual([]);
  });

  it('com menos leituras que barras, uma barra por leitura', () => {
    expect(waveformBars([-60, 0, -30], 40)).toEqual([0, 1, 0.5]);
  });

  it('com mais leituras, cada barra leva o pico do seu trecho', () => {
    const levels = [-60, -60, -10, -60, -60, -60, -60, -60];
    const bars = waveformBars(levels, 4);
    expect(bars).toHaveLength(4);
    expect(bars[0]).toBeCloseTo(levelHeight(-10));
    expect(bars.slice(1)).toEqual([0, 0, 0]);
  });
});
