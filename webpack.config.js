var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var config = require('./config');

var isDev = config.env !== 'production' || process.env.NODE_ENV !== 'production';

var modulesPath = path.join(__dirname, 'node_modules');
var reactPath = path.join(modulesPath, 'react', 'react.js')
  , reactDOMPath = path.join(modulesPath, 'react', 'lib', 'ReactDOM.js')
  , reactPureRenderPath = path.join(modulesPath, 'react','lib','ReactComponentWithPureRenderMixin.js')
  , reactCSSTransitionGroupPath = path.join(modulesPath, 'react', 'lib', 'ReactCSSTransitionGroup.js');

var axiosPath = path.join(modulesPath, 'axios','dist', 'axios.min.js');
var isProduct = config.env === 'production' || process.env.NODE_ENV === 'production';

var webpackConfig = {
  output: {
    path: path.join(__dirname, 'dist')
  },
  resolve: {
    alias: {
      'react': reactPath,
      'react-dom': reactDOMPath,
      'react-addons-pure-render-mixin': reactPureRenderPath,
      'axios': axiosPath,

      'redux': 'redux/dist/redux.min.js',
      'react-redux': 'react-redux/dist/react-redux.min.js',
      'react-router': 'react-router/umd/ReactRouter.min.js',
      'react-router-redux': 'react-router-redux/dist/ReactRouterRedux.min.js'

    },
    extensions: ['', '.js', '.jsx'],
    modules: [
      'src',
      'node_modules',
    ],
    root: [ path.join(__dirname, 'client')],
    modulesDirectories: ['node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      }, {
        test: /\.css$/,
        include: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')

      }, {
        test: /\.jsx*$/,
        exclude: /node_modules/,
        loader: 'babel',
      }, {
        test: /\.(jpe?g|gif|png|svg)$/i,
        loader: 'url-loader?limit=10000',
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }
    ]
  }

}

if (isDev) {
  webpackConfig.devtool = '#inline-source-map';
  webpackConfig.entry = [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    'babel-polyfill',
    './client/index'
  ];
  webpackConfig.output.filename = 'bundle.js';
  webpackConfig.output.publicPath = '/dist';
  webpackConfig.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development') }),
    new ExtractTextPlugin('app.css', { allChunks: true })
  ];
} else {
  webpackConfig.devtool = 'hidden-source-map';
  webpackConfig.entry = {
    app: [
      'babel-polyfill',
      './src/index.js'
    ],
    vendor: [
      'history',
      'axios',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'redux-thunk'
    ]
  };
  webpackConfig.output.filename = 'bundle.[chunkhash:7].min.js';
  webpackConfig.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: '[name].[chunkhash:7].js',
    }),
    new ExtractTextPlugin('app.[chunkhash:7].css', { allChunks: true }),

    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      compressor: {
        warnings: false,
      }
    })
  ]
}


module.exports = webpackConfig
