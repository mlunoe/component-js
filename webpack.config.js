var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var resolve = function (dir) {
    return path.resolve(__dirname, dir);
};

module.exports = {
    entry: [
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8080',
        resolve('app/main.js'),
    ],
    output: {
        path: resolve('build'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
         append: true,
         template: path.join(__dirname, 'build/index.html')
     })
    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: [resolve('node_modules')],
                loaders: ['react-hot', 'babel?presets[]=es2015,presets[]=react']
            }
        ]
    }
};
