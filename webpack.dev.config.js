const { merge } = require('webpack-merge');
const viewConfig = require('./webpack.view.config.js');

module.exports = merge(viewConfig, {
    mode: 'development',
    devServer: {
        static: './public',
    },
});
