const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// O banco de frases (assets/sentences.db) é empacotado como asset e aberto com o expo-sqlite.
config.resolver.assetExts.push('db');

// O expo-symbols só é puxado pelas abas nativas do expo-router (que o app não usa) e arrasta uma fonte de cerca de 1 MB
// para o APK. Um módulo vazio no lugar dele tira a fonte do pacote.
const emptyModule = path.resolve(__dirname, 'scripts/emptyModule.js');
const upstreamResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'expo-symbols') return { type: 'sourceFile', filePath: emptyModule };
  return (upstreamResolve ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
