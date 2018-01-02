var autoprefixer = require('autoprefixer');
var path = require('path');
var webpack = require('webpack');

/**
 * Default (production) configuration
 */
var devtool = 'source-map';
var devServer;
var entry = ['./index.js'];
var context = path.resolve(__dirname, 'src');
var output = {
  // Point output path to 'dist' by default (production)
  path: path.resolve(__dirname, 'dist'),
  // The output file location within path
  filename: './index.js',
  // Necessary for HMR to know where to load the hot update chunks
  publicPath: '/'
};
var plugins = [];

/**
 * Development configuration
 */
if (process.env.NODE_ENV === 'development') {
  devtool = 'inline-source-map';

  // Point development output path to 'build'
  output.path = path.resolve(__dirname, 'build');

  devServer = {
    // Enable HMR on the server
    hot: true,
    // Match the output path
    contentBase: path.resolve(__dirname, 'build'),
    // Match the output `publicPath`
    publicPath: '/',
    // Falls back to default which is 8080
    port: process.env.PORT,
    // Falls back to default which is localhost
    host: process.env.IP
  };

  // Add hot module replace plugin for development
  plugins.push(new webpack.HotModuleReplacementPlugin());

  // Prints more readable module names in the browser console
  // on hot module updates
  plugins.push(new webpack.NamedModulesPlugin());
}

/**
 * Production configuration
 */
if (process.env.NODE_ENV === 'production') {
  // Production specific configuration, that are not overridden by development
}

module.exports = {
  entry: entry,
  output: output,
  context: context,
  devtool: devtool,
  devServer: devServer,
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        // use: [{
        //   loader: 'babel-loader',
        //   options: {
        //     sourceMap: true
        //   }
        // }],
        exclude: /node_modules/
      },
      // Styles loader
      {
        test: /\.(sass|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: function () {
                return [autoprefixer];
              }
            }
          },
          'sass-loader'
        ],
        exclude: /node_modules/
      },
      // File HTML loader
      {
        test: /\.html$/,
        use: [{
          loader: 'file-loader',
          options: {
            // Keep original name, don't obscure
            name: '[name].[ext]'
          }
        }],
        exclude: /node_modules/
      }
    ]
  }
};
