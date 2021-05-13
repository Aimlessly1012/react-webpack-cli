const path = require("path")
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {//打包⼊⼝⽂件
    index: "./src/index.js"
  },
  output: {   //输出结构
    // filename: "[name]_[chunkhash:8].js",//利⽤占位符，⽂件名称不要重复
    // path: path.resolve(__dirname, "dist"),//输出⽂件到磁盘的⽬录，必须是绝对路径
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js'
  },
  mode: "development", //打包环境
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
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  edge: "17",
                  firefox: "60",
                  chrome: "67",
                  safari: "11.1"
                },
                useBuiltIns: "usage"//按需注⼊
              }
            ]
          ]
        }
      }
    ]
  },
  // watch: true, //默认false,不开启
  // //配合watch,只有开启才有作⽤
  // watchOptions: {
  //   //默认为空，不监听的⽂件或者⽬录，⽀持正则
  //   ignored: /node_modules/,
  //   //监听到⽂件变化后，等300ms再去执⾏，默认300ms,
  //   aggregateTimeout: 300,
  //   //判断⽂件是否发⽣变化是通过不停的询问系统指定⽂件有没有变化，默认每秒问1次
  //   poll: 1000 //ms
  // },
  devtool: "cheap-module-eval-source-map",// 开发环境配置
  // devtool: "cheap-module-source-map", // 线上⽣成配置
  devServer: {
    contentBase: "./dist",
    open: true,
    port: 8081,
    hot: true,
    //即便HMR不⽣效，浏览器也不⾃动刷新，就开启hotOnly
    hotOnly: true,
    proxy: {
      "/api": {
        target: "http://localhost:9092"
      }
    },
  },

  plugins: [
    new htmlWebpackPlugin({
      title: "My App",
      filename: "index.html",
      template: "./src/index.html",
      chunks: ['index']
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};