const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);

  custom.externals.push(...Object.keys(require('../../mf.json').bundles));

  return custom;
};
