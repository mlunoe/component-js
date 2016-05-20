var webpack = require('webpack');
var path = require('path');
var resolve = function (dir) {
    return path.resolve(__dirname, dir);
};

module.exports = {
    entry: {
        app: resolve('app/main.js'),
        vendors: ['react']
    },
    output: {
        path: resolve('dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: [resolve('node_modules')],
            loader: 'babel',
            query: {
                presets: ['es2015', 'react']
            }
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ]
};
