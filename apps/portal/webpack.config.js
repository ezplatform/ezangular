const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.externals.push('rxjs', 'rxjs/operators', 'single-spa', 'single-spa-angular', /^@angular\/.*/);
  // Feel free to modify this webpack config however you'd like to
  return custom;
};
