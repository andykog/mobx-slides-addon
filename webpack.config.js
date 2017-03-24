/* eslint-disable */

var path = require("path");
var webpack = require("webpack");

module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? undefined : "source-map",
  entry: process.env.NODE_ENV === 'production'
    ? [
        "babel-polyfill",
        "./index"
      ]
    : [
        "webpack-hot-middleware/client",
        "babel-polyfill",
        "./index"
      ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/dist/"
  },
  plugins: process.env.NODE_ENV === 'production'
    ? [
        new webpack.DefinePlugin({
          "process.env": {
            "NODE_ENV": JSON.stringify("production")
          }
        }),
      ]
    : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      vue: process.env.NODE_ENV === 'production' ? 'vue/dist/vue.esm.js' : 'vue/dist/vue.js',
    }
  },
  module: {
    loaders: [{
      test: /\.md$/,
      loader: "html-loader!markdown-loader?gfm=false"
    }, {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: "babel-loader",
    }, {
      test: /\.js$/,
      include: /node_modules\/vue/,
      loader: "babel-loader",
    }, {
      test: /\.vue$/,
      loader: 'vue'
    }, {
      test: /\.css$/,
      loaders: ["style", "css"],
      include: __dirname
    }, {
      test: /\.svg$/,
      loader: "url?mimetype=image/svg+xml",
      include: path.join(__dirname, "assets")
    }, {
      test: /\.png$/,
      loader: "url-loader?mimetype=image/png",
      include: path.join(__dirname, "assets")
    }, {
      test: /\.gif$/,
      loader: "url-loader?mimetype=image/gif",
      include: path.join(__dirname, "assets")
    }, {
      test: /\.jpg$/,
      loader: "url-loader?mimetype=image/jpg",
      include: path.join(__dirname, "assets")
    }]
  }
};
