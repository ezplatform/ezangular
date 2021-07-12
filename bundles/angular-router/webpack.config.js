const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/router': '@angular/router'
  };
  custom.output.filename = 'router.umd.min.js';
  custom.externals.push('rxjs', 'rxjs/operators', '@angular/common', '@angular/core');
  return custom;
};
