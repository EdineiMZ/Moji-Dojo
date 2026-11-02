import { ALL_KANJI } from '@/content/kanji';
import { STROKES } from '@/data/strokes';
import { flattenPath } from '@/features/strokes/svgPath';

// Roda em Node, mas o projeto só carrega os tipos do Jest: declaramos só o que usamos.
const fs = require('node:fs') as { writeFileSync(file: string, data: string): void };
const path = require('node:path') as { join(...parts: string[]): string };

/** Lado da grade em que cada kanji é desenhado (os traços do KanjiVG ocupam 109 × 109). */
const GRID = 44;
const SIZE = 109;
/** Quanto dois kanji precisam se sobrepor (0 a 1, nos dois sentidos, com 1 célula de tolerância) para contar como parecidos. */
export const MIN_SIMILARITY = 0.8;
/** Quantos parecidos guardar por kanji. */
export const PER_KANJI = 2;

const rasterize = (char: string): Uint8Array => {
  const grid = new Uint8Array(GRID * GRID);
  for (const d of STROKES[char]?.p ?? []) {
    const points = flattenPath(d);
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i] as readonly [number, number];
      const [x1, y1] = points[i + 1] as readonly [number, number];
      const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 1.2) + 1;
      for (let t = 0; t <= steps; t++) {
        const cx = Math.floor(((x0 + ((x1 - x0) * t) / steps) / SIZE) * GRID);
        const cy = Math.floor(((y0 + ((y1 - y0) * t) / steps) / SIZE) * GRID);
        if (cx >= 0 && cy >= 0 && cx < GRID && cy < GRID) grid[cy * GRID + cx] = 1;
      }
    }
  }
  return grid;
};

const dilate = (grid: Uint8Array): Uint8Array => {
  const out = new Uint8Array(grid.length);
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (!grid[y * GRID + x]) continue;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < GRID && ny < GRID) out[ny * GRID + nx] = 1;
        }
      }
    }
  }
  return out;
};

interface Shape {
  char: string;
  meaning: string;
  strokes: number;
  grid: Uint8Array;
  near: Uint8Array;
  size: number;
}

/** Quanto do traço de `a` cai perto do traço de `b` (0 a 1). */
const covered = (a: Shape, b: Shape): number => {
  let hits = 0;
  for (let i = 0; i < a.grid.length; i++) if (a.grid[i] && b.near[i]) hits++;
  return hits / a.size;
};

export function similarKanji(): Map<string, { char: string; score: number }[]> {
  const shapes: Shape[] = ALL_KANJI.filter((k) => STROKES[k.char]).map((k) => {
    const grid = rasterize(k.char);
    return { char: k.char, meaning: k.meaning, strokes: STROKES[k.char]?.p.length ?? 0, grid, near: dilate(grid), size: grid.reduce((n, v) => n + v, 0) };
  });
  const found = new Map<string, { char: string; score: number }[]>();
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      const a = shapes[i] as Shape;
      const b = shapes[j] as Shape;
      // Mesmo número de traços (ou um a mais ou a menos) e nunca o mesmo significado.
      if (Math.abs(a.strokes - b.strokes) > 1 || a.meaning === b.meaning) continue;
      const score = Math.min(covered(a, b), covered(b, a));
      if (score < MIN_SIMILARITY) continue;
      found.set(a.char, [...(found.get(a.char) ?? []), { char: b.char, score }]);
      found.set(b.char, [...(found.get(b.char) ?? []), { char: a.char, score }]);
    }
  }
  for (const [char, list] of found) found.set(char, list.sort((x, y) => y.score - x.score || x.char.localeCompare(y.char)).slice(0, PER_KANJI));
  return found;
}

(process.env.BUILD_KANJI_LOOKALIKES === '1' ? it : it.skip)('gera src/data/lookalikesKanji.ts', () => {
  const found = similarKanji();
  const lines = [...found.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([char, list]) => `  ${JSON.stringify(char)}: ${JSON.stringify(list.map((x) => x.char))},`);
  fs.writeFileSync(
    path.join(process.cwd(), 'src/data/lookalikesKanji.ts'),
    `// Gerado por \`npm run build-kanji-lookalikes\` (scripts/kanji-lookalikes). Não edite à mão.
// Kanji que se parecem na escrita, calculados a partir dos traços do KanjiVG (CC BY-SA 3.0): cada kanji desenhado numa grade de
// ${GRID} × ${GRID}, e dois kanji contam como parecidos quando cada traço fica a no máximo 1 célula do outro em pelo menos ${MIN_SIMILARITY * 100}%, com o
// mesmo número de traços (± 1) e significados diferentes. No máximo ${PER_KANJI} por kanji. Entram como alternativas erradas nas perguntas.

export const KANJI_LOOKALIKES: Readonly<Record<string, readonly string[]>> = {
${lines.join('\n')}
};
`,
  );
});

it('o cálculo acha os parecidos conhecidos (大 e 犬, 間 e 開) e nenhum par de mesmo significado', () => {
  const found = similarKanji();
  const of = (c: string) => (found.get(c) ?? []).map((x) => x.char);
  expect(of('大')).toContain('犬');
  expect(of('間')).toContain('開');
  expect(of('遠')).toContain('違');
  for (const [char, list] of found) {
    expect(list.length).toBeLessThanOrEqual(PER_KANJI);
    expect(list.map((x) => x.char)).not.toContain(char);
    expect(list.every((x) => x.score >= MIN_SIMILARITY && x.score <= 1)).toBe(true);
  }
});
