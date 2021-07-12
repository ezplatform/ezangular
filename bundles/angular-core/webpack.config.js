const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/core': '@angular/core'
  };
  custom.output.filename = 'core.umd.min.js';
  custom.externals.push('rxjs', 'rxjs/operators');
  return custom;
};
