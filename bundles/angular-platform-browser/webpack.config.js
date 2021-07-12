const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/platform-browser': '@angular/platform-browser'
  };
  custom.output.filename = 'platform-browser.umd.min.js';
  custom.externals.push('@angular/common', '@angular/core');
  return custom;
};
