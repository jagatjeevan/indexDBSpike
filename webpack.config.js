var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  entry: {
    main: path.resolve(__dirname, "src/js/app")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js"
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2017', 'react']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
          allChunks: false,
        }),
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("style.css")
  ]
}

module.exports = config;
