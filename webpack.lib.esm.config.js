const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.lib.baseconfig.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'pronolab.esm.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  },
  externals: {
    'homie-lit' : 'homie-lit',
    'rxjs': 'rxjs',
    'mqtt': 'mqtt',
    'loglevel': 'loglevel'
  },
  target: ['web', 'es2015']
});
