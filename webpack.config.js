const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: ['./sample/web/index'],
  },
  output: {
    path: path.join(__dirname, '../dist'), // 出口目录，dist文件
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-private-methods",
            ],
          },
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './sample/web/index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('development')
    })
  ],
  resolve: {
    // 自动补全后缀，注意第一个必须是空字符串,后缀一定以点开头
    extensions: ['.js', '.json'],
    alias: {
      '@root': path.resolve(__dirname),
      '@src': path.resolve(__dirname, 'src'),
    }
  },

  devServer: {
    port: 8090,
    // host: '0.0.0.0',
    // contentBase: path.join(__dirname, '../dist'),
    historyApiFallback: true,
    // openPage: 'home',
    hot: true,
  }
};
