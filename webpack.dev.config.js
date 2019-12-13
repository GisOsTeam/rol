var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
    './src/sample/index'
  ],
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css']
  },
  mode: 'development',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: ['awesome-typescript-loader'],
    }, {
      test: /\.css?$/,
      use: ['style-loader', 'css-loader']
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/sample/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true,
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
