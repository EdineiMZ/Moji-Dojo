// Dados e funções puras do script de capturas (separados do capture.mjs para o Jest poder testá-los).

/** Nome do arquivo → rota do expo-router (o grupo (tabs) não aparece na URL). */
const SCREENS = {
  inicio: '/',
  trilha: '/trail',
  ouvir: '/listen',
  frases: '/phrases',
  teclado: '/keyboard',
  'meu-mochi': '/mochi',
  ajustes: '/settings',
};

/** Monta os argumentos do adb para um aparelho. */
const adbArgs = (serial, rest) => (serial ? ['-s', serial, ...rest] : rest);

module.exports = { SCREENS, adbArgs };
