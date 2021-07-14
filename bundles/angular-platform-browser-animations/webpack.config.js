const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/platform-browser/animations': '@angular/platform-browser/animations'
  };
  custom.output.filename = 'platform-browser-animations.umd.min.js';
  custom.externals.push(
    'tslib',
    '@angular/animations',
    '@angular/animations/browser',
    '@angular/common',
    '@angular/core',
    '@angular/platform-browser'
  );
  return custom;
};
