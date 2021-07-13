const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/compiler': '@angular/compiler'
  };
  custom.output.filename = 'compiler.umd.min.js';
  custom.externals.push('tslib');
  return custom;
};
