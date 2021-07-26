const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);

  custom.output.filename = 'portal.umd.js';
  custom.module.rules.push({
    test: /\.html$/i,
    loader: 'html-loader'
  });
  custom.externals.push(...Object.keys(require('../../mf.json').bundles).filter(e => e !== 'single-spa'));
  custom.devServer = {
    historyApiFallback: true,
    contentBase: path.resolve(process.cwd(), 'src'),
    headers: {
      'Access-Control-Allow-Headers': '*'
    },
    port: 4200
  };

  return merge(custom, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: 'apps/portal/src/single-spa/index.ejs',
        templateParameters: {
          isDevMode: config && (config.isLocal || config.mode === 'development')
        }
      })
    ]
  });
};
