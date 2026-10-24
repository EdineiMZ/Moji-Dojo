const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// O banco de frases (assets/sentences.db) é empacotado como asset e aberto com o expo-sqlite.
config.resolver.assetExts.push('db');

module.exports = config;
