const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // jsonpFunction removed on webpack 5
  delete singleSpaWebpackConfig.output.jsonpFunction;

  singleSpaWebpackConfig.externals.push('rxjs', 'rxjs/operators', 'single-spa', 'single-spa-angular', /^@angular\/.*/);

  // Feel free to modify this webpack config however you'd like to
  return singleSpaWebpackConfig;
};
