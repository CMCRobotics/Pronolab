const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.lib.baseconfig.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: 'pronolab.core.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Pronolab',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    'rxjs': 'rxjs',
    'mqtt': 'mqtt',
    'loglevel': 'loglevel'
  }
});
