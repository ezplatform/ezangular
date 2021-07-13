const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/router': '@angular/router'
  };
  custom.output.filename = 'router.umd.min.js';
  custom.externals.push('tslib', 'rxjs', 'rxjs/operators', '@angular/common', '@angular/core', '@angular/platform-browser');
  return custom;
};
