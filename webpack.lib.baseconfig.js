const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js');

module.exports = merge(baseConfig, {
    entry: './src/index.ts',
    output: {
        filename: 'pronolab.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'umd'
        }
        ,globalObject: 'this'
      }
  });