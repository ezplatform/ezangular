const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  // custom.externals.push('rxjs', 'rxjs/operators', 'single-spa', 'single-spa-angular', /^@angular\/.*/);
  custom.externals.push(
    'rxjs',
    'rxjs/operators',
    'single-spa',
    'single-spa-angular',
    '@angular/animations',
    '@angular/common',
    '@angular/common/http',
    '@angular/compiler',
    '@angular/core',
    '@angular/forms',
    '@angular/platform-browser',
    '@angular/platform-browser/animations',
    '@angular/router',
    '@angular/service-worker'
  );
  // Feel free to modify this webpack config however you'd like to
  return custom;
};
