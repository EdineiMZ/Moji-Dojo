// Gera os ícones do app (ícone, adaptativo, monocromático, splash, favicon) a partir do desenho do Mochi
// (o mesmo de src/components/mascot/MochiArt.tsx, humor "happy"). Requer o Inkscape no PATH ou em
// "C:\Program Files\Inkscape\bin". Uso: node scripts/gerar-icones.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BODY = '#FFF8F1';
const LINE = '#4A3B5C';
const PINK = '#FFB9D0';
const BLUSH = '#FF93B2';

const arm = (cx, cy, rot) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="10" ry="16" transform="rotate(${rot} ${cx} ${cy})"/>`;

/** Mochi colorido, viewBox 200 x 190. */
const mochi = `
  <g stroke="${LINE}" stroke-width="4" stroke-linejoin="round" fill="${BODY}">
    <polygon points="46,86 52,32 94,58"/><polygon points="154,86 148,32 106,58"/>
  </g>
  <g fill="${PINK}"><polygon points="58,72 59,48 79,60"/><polygon points="142,72 141,48 121,60"/></g>
  <g fill="${BODY}" stroke="${LINE}" stroke-width="4">
    <ellipse cx="72" cy="170" rx="21" ry="11"/><ellipse cx="128" cy="170" rx="21" ry="11"/>
  </g>
  <path d="M30 118 C30 74 62 50 100 50 C138 50 170 74 170 118 C170 150 148 172 100 172 C52 172 30 150 30 118 Z"
    fill="${BODY}" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>
  <g fill="${BODY}" stroke="${LINE}" stroke-width="4">${arm(32, 134, 14)}${arm(168, 134, -14)}</g>
  <ellipse cx="56" cy="128" rx="10" ry="6" fill="${BLUSH}" opacity="0.55"/>
  <ellipse cx="144" cy="128" rx="10" ry="6" fill="${BLUSH}" opacity="0.55"/>
  <g fill="none" stroke="${LINE}" stroke-width="5" stroke-linecap="round">
    <path d="M64 112 Q75 96 86 112"/><path d="M114 112 Q125 96 136 112"/>
  </g>
  <ellipse cx="100" cy="120" rx="4.5" ry="3.2" fill="${BLUSH}"/>
  <path d="M90 129 Q95 139 100 130 Q105 139 110 129" fill="none" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>
  <g stroke="${LINE}" stroke-width="2" stroke-linecap="round" opacity="0.55">
    <path d="M36 120 L54 122"/><path d="M36 130 L54 128"/><path d="M164 120 L146 122"/><path d="M164 130 L146 128"/>
  </g>`;

/** Silhueta para o ícone monocromático do Android 13+ (só o canal alfa importa). */
const silhouette = `
  <defs><mask id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="190">
    <rect width="200" height="190" fill="#fff"/>
    <g fill="none" stroke="#000" stroke-width="6" stroke-linecap="round">
      <path d="M64 112 Q75 96 86 112"/><path d="M114 112 Q125 96 136 112"/>
      <path d="M90 129 Q95 139 100 130 Q105 139 110 129"/>
    </g>
    <ellipse cx="100" cy="120" rx="5" ry="3.7" fill="#000"/>
    <polygon points="58,72 59,48 79,60" fill="#000"/><polygon points="142,72 141,48 121,60" fill="#000"/>
  </mask></defs>
  <g mask="url(#cut)" fill="#000" stroke="#000" stroke-width="4" stroke-linejoin="round">
    <polygon points="46,86 52,32 94,58"/><polygon points="154,86 148,32 106,58"/>
    <ellipse cx="72" cy="170" rx="21" ry="11"/><ellipse cx="128" cy="170" rx="21" ry="11"/>
    <path d="M30 118 C30 74 62 50 100 50 C138 50 170 74 170 118 C170 150 148 172 100 172 C52 172 30 150 30 118 Z"/>
    ${arm(32, 134, 14)}${arm(168, 134, -14)}
  </g>`;

const gradient = `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#FFD3E2"/><stop offset="1" stop-color="#FFF1F5"/></linearGradient></defs>`;

// O Mochi ocupa 200 x 190 no seu próprio espaço; centraliza em (512, 512) numa tela de 1024.
const place = (art, scale) => `<g transform="translate(${512 - 100 * scale} ${512 - 107 * scale}) scale(${scale})">${art}</g>`;
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${body}</svg>`;

const outputs = {
  'icon.png': { size: 1024, svg: svg(`${gradient}<rect width="1024" height="1024" fill="url(#bg)"/>${place(mochi, 4.4)}`) },
  // O Android recorta o adaptativo a ~66% central: o Mochi fica dentro dessa zona segura.
  'android-icon-foreground.png': { size: 1024, svg: svg(place(mochi, 3.2)) },
  'android-icon-background.png': { size: 1024, svg: svg(`${gradient}<rect width="1024" height="1024" fill="url(#bg)"/>`) },
  'android-icon-monochrome.png': { size: 1024, svg: svg(place(silhouette, 3.2)) },
  'splash-icon.png': { size: 1024, svg: svg(place(mochi, 4.4)) },
  'favicon.png': { size: 48, svg: svg(`${gradient}<rect width="1024" height="1024" rx="200" fill="url(#bg)"/>${place(mochi, 4.2)}`) },
};

const inkscape = existsSync('C:\\Program Files\\Inkscape\\bin\\inkscape.exe')
  ? 'C:\\Program Files\\Inkscape\\bin\\inkscape.exe'
  : 'inkscape';
const tmp = mkdtempSync(join(tmpdir(), 'moji-icones-'));
mkdirSync('assets', { recursive: true });
try {
  for (const [name, { size, svg: source }] of Object.entries(outputs)) {
    const src = join(tmp, name.replace('.png', '.svg'));
    writeFileSync(src, source);
    execFileSync(inkscape, [src, '--export-type=png', `--export-filename=${join('assets', name)}`, `--export-width=${size}`, `--export-height=${size}`]);
    console.log('assets/' + name);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
