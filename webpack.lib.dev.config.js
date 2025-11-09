const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.lib.baseconfig.js');

module.exports = merge(baseConfig, {
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/',
      },
    ],
    compress: false,
    port: 9000,
  },
  output: {
    library: 'Pronolab',
    libraryTarget: 'umd',
  },
  mode: 'development'
  });