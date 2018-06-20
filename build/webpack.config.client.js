
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
	VueLoaderPlugin
} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.config.base.js');
const isDev = process.env.NODE_ENV === 'development';

// 客户端公用的plugin
const defaultPlugins = [
	new VueLoaderPlugin(),
	new HtmlWebpackPlugin({
    template:path.join(__dirname,'template.html')
  }),
];

let config;
if (isDev) {
	config = merge(baseConfig, {
		mode: 'development',
		entry: path.join(__dirname, '../client/index.js'),
		module: {
			rules: [{
				test: /\.less$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader',
					'less-loader'
				]
			}]
		},
		devServer: {
			contentBase: path.join(__dirname, '../dist'),
			compress: true,
			port: 9001,
      hot: true,
      historyApiFallback: true,
		},
		plugins: defaultPlugins.concat([
			new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				isDev: true,
			}),
		])
	});
} else {
	config = merge(baseConfig, {
		mode: 'production',
		entry: path.join(__dirname, '../client/index.js'),
		output: {
			filename: '[name]-[hash:8].js'
		},
		module: {
			rules: [{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'less-loader'
				]
			}]
		},

		plugins: defaultPlugins.concat([
			new MiniCssExtractPlugin({
				filename: '[name]-[hash:8].css',
				chunkFilename: '[name]-[hash:8].css'
			}),
		])
	});
}

module.exports = config;