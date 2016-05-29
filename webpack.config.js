var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var resolve = function (dir) {
	return path.resolve(__dirname, dir);
};

/**
 * Default configuration
 */
var devtool = 'source-map';
var entry = [resolve('app/index.js')];
var output = {
	path: resolve('dist'),
	filename: 'index.js'
};
var plugins = [
	new HtmlWebpackPlugin({
		append: true,
		template: path.join(__dirname, 'build/index.html')
	})
];

/**
 * Production configuration
 */
if (process.env.NODE_ENV === 'production') {
	// Make sure to optimize JavaScript
	plugins.push(
		new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
	);
}

/**
 * Development configuration
 */
if (process.env.NODE_ENV === 'development') {
  // eval-source-map is the same thing as source-map,
  // except with caching. Don't use in production.
  devtool = 'eval-source-map';

  // Add Webpack dev server
  entry.push('webpack/hot/dev-server');
  entry.push('webpack-dev-server/client?http://localhost:8080');

	// Point development output path to 'build'
	output.path = resolve('build');

	// Add hot module replace plugin for development
	plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
	devtool: devtool,
	entry: entry,
	output: output,
	plugins: plugins,
	module: {
		loaders: [
			// JavaScript loader
			{
				test: /\.(js|jsx)$/,
				exclude: [resolve('node_modules')],
				loader: 'babel',
				query: {
					presets: ['es2015'] // 'react-hot'
				}
			},
			// SCSS loader
			{
        test: /\.scss$/,
        loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
      },
      // File loaders for bootstrap fonts
      {
      	test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      	loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
      	test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      	loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
      	test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      	loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
      	test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      	loader: 'file'
      },
      {
      	test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      	loader: 'url?limit=10000&mimetype=image/svg+xml'
    	}
		]
	}
};
