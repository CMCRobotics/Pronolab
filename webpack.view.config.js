const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.lib.baseconfig.js');

module.exports = merge(baseConfig, {
    mode: 'production',
    entry: './src/view/index.ts',
    devtool: 'source-map',
    output: {
      filename: 'pronolab-view.js',
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
