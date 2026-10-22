import { KANJI } from '@/data/kanji';
import { KANA } from '@/data/kana';
import { STROKES } from '@/data/strokes';
import { pathLength } from './pathLength';

describe('pathLength', () => {
  it('linhas retas (absolutas e relativas)', () => {
    expect(pathLength('M0,0 L3,4')).toBeCloseTo(5);
    expect(pathLength('M0,0 l3,4')).toBeCloseTo(5);
    expect(pathLength('M1,1 h10 v10')).toBeCloseTo(20);
    expect(pathLength('M1,1 H11 V11')).toBeCloseTo(20);
  });

  it('Z fecha o caminho', () => {
    expect(pathLength('M0,0 h10 v10 z')).toBeCloseTo(10 + 10 + Math.hypot(10, 10));
  });

  it('pares extras depois do M valem como linhas', () => {
    expect(pathLength('M0,0 3,4')).toBeCloseTo(5);
  });

  it('curva cúbica que é uma reta tem o comprimento da reta', () => {
    expect(pathLength('M0,0 C10,0 20,0 30,0')).toBeCloseTo(30, 3);
    expect(pathLength('M0,0 c10,0 20,0 30,0')).toBeCloseTo(30, 3);
  });

  it('S reflete o ponto de controle anterior (S equivale ao C refletido)', () => {
    // C0,0→(0,10),(10,10),(10,0) seguido de S: o 1º controle vira (10,-10).
    const withS = pathLength('M0,0 C0,10 10,10 10,0 S20,-10 20,0');
    const withC = pathLength('M0,0 C0,10 10,10 10,0 C10,-10 20,-10 20,0');
    expect(withS).toBeCloseTo(withC);
  });

  it('números negativos e decimais colados', () => {
    expect(pathLength('M10.5-2.5l-3.5,4')).toBeCloseTo(Math.hypot(3.5, 4));
  });

  it('recusa comandos que não suporta em vez de errar em silêncio', () => {
    expect(() => pathLength('M0,0 A5,5 0 0 1 10,0')).toThrow();
  });

  it('todos os traços dos dados têm comprimento positivo e finito', () => {
    for (const { char } of [...KANA, ...KANJI]) {
      for (const d of STROKES[char]?.p ?? []) {
        const length = pathLength(d);
        expect(Number.isFinite(length)).toBe(true);
        expect(length).toBeGreaterThan(1);
      }
    }
  });
});
