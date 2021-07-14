const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/common/http': '@angular/common/http'
  };
  custom.output.filename = 'common-http.umd.min.js';
  custom.externals.push('tslib', 'rxjs', 'rxjs/operators', '@angular/common', '@angular/core');
  return custom;
};
