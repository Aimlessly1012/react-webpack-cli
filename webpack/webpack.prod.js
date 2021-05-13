const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const prodConfig = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name]_[chunkhash:8].js',
    chunkFilename: 'js/[name]_[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
            //⼩于2048，才转换成base64
            limit: 2048
          }
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        use: "file-loader"
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  mode: "production",
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
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ]
};
module.exports = prodConfig