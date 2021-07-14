const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/animations/browser': '@angular/animations/browser'
  };
  custom.output.filename = 'animations-browser.umd.min.js';
  custom.externals.push('tslib', '@angular/animations', '@angular/core');
  return custom;
};
