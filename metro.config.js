const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Firebase için resolver ayarları
config.resolver.platforms = ["ios", "android", "native", "web"];

// Firebase ES module sorununu çözmek için
config.resolver.resolverMainFields = ["react-native", "browser", "main"];
config.resolver.sourceExts = ["js", "json", "ts", "tsx", "jsx"];

module.exports = config;
