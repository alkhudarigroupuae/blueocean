const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Force Metro to use the CJS version of zustand
config.resolver.extraNodeModules = {
  'zustand': path.resolve(__dirname, 'node_modules/zustand/index.js'),
  'zustand/middleware': path.resolve(__dirname, 'node_modules/zustand/middleware.js'),
};

module.exports = config;
