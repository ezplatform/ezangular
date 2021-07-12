'use strict';
const fs = require('fs'),
  path = require('path');

let config = {};
// Modified to fix for Firebase Functions
const configJson = path.resolve('configs/import-map-deployer.json');

if (fs.existsSync(configJson)) {
  config = JSON.parse(fs.readFileSync(configJson));
}

exports.setConfig = newConfig => (config = newConfig);
exports.getConfig = () => config;
