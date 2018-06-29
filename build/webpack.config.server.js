const path = require('path')
const ExtractPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const VueServerPlugin = require('vue-server-renderer/server-plugin')
const {
  VueLoaderPlugin
} = require('vue-loader');

let config

process.env.NODE_ENV = 'development'

const plugins = [
  new ExtractPlugin('styles.[hash:8].css'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VUE_ENV': '"server"'
  }),
  new VueLoaderPlugin(),
  new VueServerPlugin()
]

config = {
  mode: 'development',
  target: 'node',
  entry: path.join(__dirname, '../client/server-entry.js'),
  devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs2',
    filename: 'server-entry.js',
    path: path.join(__dirname, '../server-build')

  },
  externals: Object.keys(require('../package.json').dependencies),
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          preserveWhitepace: true,
          extractCSS: false,
          cssModules: {
            localIdentName: '[hash:base64:5]',
            camelCase: true
          }
        }
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: 'resources/[path][name].[hash:8].[ext]'
          }
        }]
      },
      {
        test: /\.less/,
        use: [{
          loader: 'vue-style-loader'
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      },
    ]
  },
  plugins
};

module.exports = config
