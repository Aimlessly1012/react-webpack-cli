const webpack = require("webpack");
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devConfig = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].[hash:5]..js',
    auxiliaryComment: "Test Comment"
  },
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    contentBase: "./dist",
    open: true,
    port: 8081,
    hot: true,
    compress: true,
    inline: true,
    noInfo: true,
    quiet: true,
    clientLogLevel: 'none',
    overlay: {
      warnings: true,
      errors: true,
    },
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:9092"
    //   }
    // },
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "My App",
      filename: "index.html",
      template: "./src/index.html",
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        // conservativeCollapse: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
  ]
};
module.exports = devConfig
// module.exports = merge(baseConfig, devConfig)
