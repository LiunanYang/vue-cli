// 此文件是 vue 开发环境的 webpack 相关配置文件

'use strict'
// 引入 utils 配置文件，主要用来处理 css loader
const utils = require('./utils')
// 引入 webpack ，使用 webpack 内置插件
const webpack = require('webpack')
// 引入 config 目录下的 index.js
const config = require('../config')
// webpack-merge 插件，合并 webpack 配置对象，把 webpack 配置文件拆分成几个小的模块，然后合并
const merge = require('webpack-merge')
// 引入 nodejs 路径模块
const path = require('path')
// 主要处理各种文件的 loader 配置
const baseWebpackConfig = require('./webpack.base.conf')
// copy-webpack-plugin 插件，在 webpack 中拷贝文件和文件夹到指定的目录下
const CopyWebpackPlugin = require('copy-webpack-plugin')
// html-webpack-plugin 插件，自动生成 html，能够把资源自动加载到 html 文件中
//  详情看(1)
const HtmlWebpackPlugin = require('html-webpack-plugin')
// friendly-errors-webpack-plugin 插件，把 webpack 的错误和日志收集起来，漂亮的展示给用户
// 详情看(2)
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 端口查找插件 portfinder
const portfinder = require('portfinder')

// ?
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

// 下面 合并配置文件，将这个配置文件特有的配置添加替换到 base 配置文件中
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // 下面是把 utils 配置中的处理 css 类似文件的处理方法拿过来，并且不生成 cssMap 文件
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  // devtool 是开发工具选项，用来指定如何生成 sourcemap 文件
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
