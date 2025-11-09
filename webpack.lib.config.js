const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.lib.baseconfig.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(baseConfig, {
    mode: 'production',
    
    devtool: 'source-map',
    output: {
      filename: 'pronolab.min.js',
      library: 'Pronolab',
      libraryTarget: 'umd'
    }
  });