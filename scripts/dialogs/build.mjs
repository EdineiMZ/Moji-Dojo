// Gera src/content/dialogs.ts a partir de scripts/dialogs/scenes.mjs. Uso: npm run build-dialogs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { SCENES } from './scenes.mjs';

const require = createRequire(import.meta.url);
const { parseAnnotation } = require('../grammar-n5/romaji.cjs');

// As frases de Viagem estão num arquivo TS gerado: lê a lista de dentro dele.
const travelSource = readFileSync(new URL('../../src/data/travel.ts', import.meta.url), 'utf8');
const travelList = travelSource.match(/\[\n([\s\S]*)\n\];/)?.[1];
if (!travelList) throw new Error('não achei a lista em src/data/travel.ts');
// As frases escritas depois (src/content/travelExtra.ts) são JSON depois do "=": lê também.
const extraSource = readFileSync(new URL('../../src/content/travelExtra.ts', import.meta.url), 'utf8');
const extraList = JSON.parse(extraSource.slice(extraSource.indexOf('= [') + 2, extraSource.lastIndexOf(';')));
const TRAVEL = new Map([
  // eslint-disable-next-line no-eval
  ...eval(`[${travelList.replace(/,\s*$/, '')}]`),
  ...extraList,
].flatMap((category) => category.phrases.map((p) => [p.jp, p])));

function optionOf([jp, ok, why]) {
  const phrase = TRAVEL.get(jp);
  if (!phrase) throw new Error(`a frase não está em Viagem: ${jp}`);
  if (!ok && !why) throw new Error(`resposta errada sem motivo: ${jp}`);
  return { jp: phrase.jp, romaji: phrase.romaji, pt: phrase.pt, ok, ...(ok ? {} : { why }) };
}

function turnOf(turn, where) {
  if (turn.narrator) return { kind: 'narrator', pt: turn.narrator };
  if (turn.staff) {
    if (!turn.pt) throw new Error(`${where}: fala do atendente sem tradução`);
    const { jp, romaji } = parseAnnotation(turn.staff);
    return { kind: 'staff', jp, romaji, pt: turn.pt };
  }
  if (turn.you) {
    const options = turn.you.map(optionOf);
    if (options.filter((o) => o.ok).length !== 1) throw new Error(`${where}: precisa de exatamente uma resposta certa`);
    return { kind: 'you', options };
  }
  throw new Error(`${where}: turno desconhecido`);
}

const scenes = SCENES.map((scene) => ({
  id: scene.id,
  title: scene.title,
  place: scene.place,
  intro: scene.intro,
  turns: scene.turns.map((t, i) => turnOf(t, `${scene.id}#${i}`)),
}));

const header = `// Gerado por \`npm run build-dialogs\` a partir de scripts/dialogs/scenes.mjs. Não edite à mão.
// As falas do aluno são frases de Viagem (src/data/travel.ts). As do atendente são frases fixas de atendimento,
// escritas para o app: precisam de revisão por quem fala japonês (ver src/content/LICENSE.md).

/** Uma resposta possível do aluno. As erradas dizem por que não servem naquele momento. */
export interface DialogOption {
  jp: string;
  romaji: string;
  pt: string;
  ok: boolean;
  why?: string;
}

export type DialogTurn =
  | { kind: 'narrator'; pt: string }
  | { kind: 'staff'; jp: string; romaji: string; pt: string }
  | { kind: 'you'; options: readonly DialogOption[] };

export interface DialogScene {
  id: string;
  title: string;
  /** Categoria de Viagem a que a cena se liga. */
  place: string;
  intro: string;
  turns: readonly DialogTurn[];
}

`;

writeFileSync(
  new URL('../../src/content/dialogs.ts', import.meta.url),
  `${header}export const DIALOG_SCENES: readonly DialogScene[] = ${JSON.stringify(scenes, null, 2)};\n`,
);
console.log(`${scenes.length} cenas, ${scenes.reduce((n, s) => n + s.turns.filter((t) => t.kind === 'you').length, 0)} turnos do aluno`);
