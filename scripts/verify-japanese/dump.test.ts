// Junta todo o japonês escrito por IA (frases de viagem, falas do atendente, moldes e leituras) num JSON, para
// scripts/verify-japanese/run.mjs conferir com o Tatoeba. Uso: npm run verify-japanese
import { ALL_TRAVEL } from '@/content/travel';
import { TRAVEL_EXTRA } from '@/content/travelExtra';
import { DIALOG_SCENES } from '@/content/dialogs';
import { FRAMES, fillFrame } from '@/features/frames/frames';
import { READINGS } from '@/content/readings';

const fs = require('node:fs') as { writeFileSync(file: string, data: string): void };
const run = process.env.VERIFY_JA_OUT ? it : it.skip;

run('lista o japonês escrito por IA', () => {
  const extra = new Set(TRAVEL_EXTRA.flatMap((c) => c.phrases.map((p) => p.jp)));
  const rows: { src: string; where: string; jp: string; pt: string }[] = [];
  for (const c of ALL_TRAVEL) for (const p of c.phrases) rows.push({ src: extra.has(p.jp) ? 'viagem-ia' : 'viagem-original', where: c.category, jp: p.jp, pt: p.pt });
  for (const s of DIALOG_SCENES) for (const t of s.turns) if (t.kind === 'staff') rows.push({ src: 'atendente-ia', where: s.id, jp: t.jp, pt: t.pt });
  for (const f of FRAMES) for (const w of f.words) { const o = fillFrame(f, w); rows.push({ src: 'molde-ia', where: f.id, jp: o.jp, pt: o.pt }); }
  for (const t of READINGS) for (const l of t.lines) rows.push({ src: t.kind === 'dia' ? 'leitura-dia' : 'leitura-texto', where: t.id, jp: l.jp, pt: l.pt });
  fs.writeFileSync(process.env.VERIFY_JA_OUT as string, JSON.stringify(rows));
});
