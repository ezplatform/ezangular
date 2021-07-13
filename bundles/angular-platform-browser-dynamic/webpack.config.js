const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/platform-browser-dynamic': '@angular/platform-browser-dynamic'
  };
  custom.output.filename = 'platform-browser-dynamic.umd.min.js';
  custom.externals.push('tslib', '@angular/core', '@angular/common', '@angular/compiler', '@angular/platform-browser');
  return custom;
};
