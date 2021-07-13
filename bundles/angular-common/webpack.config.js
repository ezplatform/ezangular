const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/common': '@angular/common'
  };
  custom.output.filename = 'common.umd.min.js';
  custom.externals.push('tslib', 'rxjs', 'rxjs/operators', '@angular/core');
  return custom;
};
