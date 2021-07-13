const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '@angular/forms': '@angular/forms'
  };
  custom.output.filename = 'forms.umd.min.js';
  custom.externals.push('tslib', 'rxjs', 'rxjs/operators', '@angular/core', '@angular/common', '@angular/platform-browser');
  return custom;
};
