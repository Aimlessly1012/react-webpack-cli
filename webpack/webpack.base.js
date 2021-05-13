const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { merge } = require("webpack-merge")
const devConfig = require('./webpack.dev')
const prodConfig = require('./webpack.prod')
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');


const commonConfig = {
  entry: {
    index: "./src/index.tsx"
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less'],
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        use: ['happypack/loader?id=js'],
        exclude: /node_modules/,
      },
      {
        test: /\.ts[x]?$/,
        exclude: /node_modules/,
        use: [
          'cache-loader',
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
              reloadAll: true,
            },
          },
          'cache-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: { javascriptEnabled: true },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico|ttf|eot|svg|woff|woff2)/i,
        //use: 'file?name=img_[hash:5].[ext]',
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 8192,
              name: 'static/media/[name].[contenthash:5].[ext]',
            },
          },
        ],
      },
    ]
  },
  optimization: {
    //帮我们⾃动做代码分割
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
        vendor: {
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          test: 'node_modules',
          priority: 1,
        },
        utils: {
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
        },
      },
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    }),
    new HappyPack({
      id: 'js',
      loaders: ['cache-loader', 'babel-loader'],
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          ` \u001b[31m 编译成功 \u001b[0m  ${new Date().toLocaleString()}`,
          '♫ happy code ♫ ',
        ],
      },
      clearConsole: true,
      onErrors: function (severity, errors) {
        console.error(errors);
      },
    }),
  ]
};
module.exports = (env) => {
  if (env && env.production) {
    return merge(commonConfig, prodConfig)
  } else {
    return merge(commonConfig, devConfig)
  }
}