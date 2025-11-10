const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.lib.baseconfig.js');

module.exports = merge(baseConfig, {
    mode: 'production',
    entry: {
      'pronolab-view': './src/view/index.ts',
      'session-controller-view': './src/view/session-controller-index.ts'
    },
    devtool: 'source-map',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'public'),
    },
    resolve: {
      fallback: {
        "fs": false,
        "path": false,
        "util": false
      }
    }
  });
