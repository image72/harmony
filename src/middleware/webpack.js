const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);

module.exports = (app) => {
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,

    stats: {
      colors: true,
      hash: true,
      version: false,
      timings: true,
      assets: true,
      chunks: true,
      chunkModules: true,
      modules: false,
      cached: false,
      reasons: false,
      source: false,
      errorDetails: true
    }

  }));
  app.use(require('webpack-hot-middleware')(compiler));
}
