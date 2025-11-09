const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js');
const webpack = require('webpack');

module.exports = merge(baseConfig, {
    entry: './src/index.ts',
    output: {
        filename: 'pronolab.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: 'umd'
        }
        ,globalObject: 'this'
      },
      resolve: {
        fallback: {
          "util": require.resolve("util/"),
          "fs": false,
          "process": require.resolve("process/browser")
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ]
  });
