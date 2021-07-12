const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    'single-spa-angular': 'single-spa-angular'
  };
  custom.output.filename = 'single-spa-angular.umd.min.js';
  custom.externals.push('tslib', '@angular/common', '@angular/core');
  return custom;
};
