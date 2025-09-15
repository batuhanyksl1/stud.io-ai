const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Platformlar
config.resolver.platforms = ["ios", "android", "native", "web"];

// Modern paketlerin ESM/CJS dosyalarını da çözebilmesi için uzantıları genişlet
const defaultSourceExts = config.resolver.sourceExts ?? [];
config.resolver.sourceExts = Array.from(
  new Set([...defaultSourceExts, "cjs", "mjs"]),
);

// Not: resolverMainFields override etmiyoruz; Expo/Metro varsayılanları
// package.json "exports" alanını destekliyor ve Redux/RTK ile daha uyumlu.

module.exports = config;
