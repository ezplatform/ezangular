const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/service-worker': '@angular/service-worker'
  };
  custom.output.filename = 'service-worker.umd.min.js';
  custom.externals.push('tslib', '@angular/core', '@angular/common');
  return custom;
};
