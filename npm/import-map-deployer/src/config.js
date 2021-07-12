'use strict';
const fs = require('fs'),
  path = require('path');

let config = {};
// Modified to fix for Firebase Functions
const configJson = path.resolve('import-map-deployer-config.json');

if (fs.existsSync(configJson)) {
  config = JSON.parse(fs.readFileSync(configJson));
}

exports.setConfig = newConfig => (config = newConfig);
exports.getConfig = () => config;
