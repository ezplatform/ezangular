const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/animations': '@angular/animations'
  };
  custom.output.filename = 'animations.umd.min.js';
  custom.externals.push('tslib', '@angular/core');
  return custom;
};
