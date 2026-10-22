// Regras de versão do app, usadas pelo CLI (scripts/version.mjs) e pelos testes (Jest).
// É CommonJS de propósito, como scripts/sfxSynth.cjs: os dois lados usam exatamente o mesmo código.
//
// Política (versão semântica MAIOR.MENOR.CORREÇÃO):
// - MENOR: cada fase do ROADMAP.md concluída (ou uma novidade grande).
// - CORREÇÃO: ajustes e correções entre fases.
// - MAIOR: só numa virada grande (ex.: publicação em loja ou formato de progresso incompatível).
// A versão fica em app.json (fonte), espelhada em package.json e package-lock.json, e cada versão
// precisa de uma entrada no CHANGELOG.md.

const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;
const CHANGELOG_HEADING = /^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})\s*$/m;
/** Texto que `bump` coloca no changelog; enquanto existir, o teste falha (a entrada não foi escrita). */
const CHANGELOG_PLACEHOLDER = '_a descrever_';

/** "1.2.3" → [1, 2, 3]. */
function parseVersion(version) {
  const m = SEMVER.exec(version);
  if (!m) throw new Error(`Versão inválida: "${version}" (use MAIOR.MENOR.CORREÇÃO, ex.: 1.2.0)`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** Próxima versão: kind = "major" | "minor" | "patch". */
function bumpVersion(version, kind) {
  const [major, minor, patch] = parseVersion(version);
  if (kind === 'major') return `${major + 1}.0.0`;
  if (kind === 'minor') return `${major}.${minor + 1}.0`;
  if (kind === 'patch') return `${major}.${minor}.${patch + 1}`;
  throw new Error(`Tipo de aumento inválido: "${kind}" (use major, minor ou patch)`);
}

/**
 * versionCode do Android: um inteiro que só cresce, sem o qual o aparelho recusa instalar a atualização
 * por cima. Derivado da versão (1.2.3 → 10203), então nunca precisa ser mantido à mão.
 */
function versionCode(version) {
  const [major, minor, patch] = parseVersion(version);
  if (minor > 99 || patch > 99) throw new Error('Versão grande demais para o versionCode (MENOR e CORREÇÃO vão até 99).');
  return major * 10000 + minor * 100 + patch;
}

/** Nome do APK gerado: nome do app + versão, ex.: MojiDojo-1.1.0.apk. */
const apkName = (version) => `MojiDojo-${parseVersion(version).join('.')}.apk`;

/** Versão da entrada mais recente do changelog (a primeira "## [x.y.z] - data"), ou null. */
function latestChangelogVersion(text) {
  const m = CHANGELOG_HEADING.exec(text);
  return m ? m[1] : null;
}

/** Problemas da entrada do changelog para esta versão; lista vazia = tudo certo. */
function changelogProblems(text, version) {
  const latest = latestChangelogVersion(text);
  if (latest === null) return ['O CHANGELOG.md não tem nenhuma entrada "## [x.y.z] - AAAA-MM-DD".'];
  if (latest !== version) {
    return [`A entrada mais recente do CHANGELOG.md é a ${latest}, mas o app está na ${version}. Rode "npm run version:bump" ou escreva a entrada.`];
  }
  const start = text.search(CHANGELOG_HEADING);
  const rest = text.slice(start + 1);
  const next = rest.search(/^## \[/m);
  const section = next < 0 ? rest : rest.slice(0, next);
  if (section.includes(CHANGELOG_PLACEHOLDER)) return [`A entrada ${version} do CHANGELOG.md ainda está com "${CHANGELOG_PLACEHOLDER}": descreva o que mudou.`];
  return [];
}

/** Insere, no topo do changelog, a entrada de uma versão nova com o texto provisório. */
function addChangelogEntry(text, version, date) {
  const entry = `## [${version}] - ${date}\n\n- ${CHANGELOG_PLACEHOLDER}\n\n`;
  const at = text.search(/^## \[/m);
  return at < 0 ? `${text.trimEnd()}\n\n${entry}` : text.slice(0, at) + entry + text.slice(at);
}

module.exports = {
  CHANGELOG_PLACEHOLDER,
  parseVersion,
  bumpVersion,
  versionCode,
  apkName,
  latestChangelogVersion,
  changelogProblems,
  addChangelogEntry,
};
