// 此文件是用来定义开发环境和生产环境中所需要的参数

'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

// 引入 nodejs 路径模块，处理路径统一的问题
const path = require('path')

module.exports = {
  dev: {

    // Paths
    // 静态资源文件夹 默认 "static"
    assetsSubDirectory: 'static',
    // 发布路径
    assetsPublicPath: '/',
    // 配置代理API
    proxyTable: {},

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    // 下面是 dev-server 的端口号，可以自行更改
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    // 表示是否自动打开浏览器
    autoOpenBrowser: true,
    // 查询错误
    errorOverlay: true,
    // 通知错误
    notifyOnErrors: true,
    // poll 是跟 devserver 相关的一个配置，webpack 为我们提供的 devserver 是可以监控文件改动的，但在有的情况下却不能工作，我们可以设置一个轮询(poll)来解决
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    // 是否使用 eslint
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  // 下面是生产编译环境下的一些配置
  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    // 定义的静态资源根目录，也就是 dist 目录
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 定义的是静态资源根目录的子目录 static ，也就是 dist 目录下面的 static
    assetsSubDirectory: 'static',
    // 静态资源的公开路径
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    // 定义是否生成生产环境的 sourcemap，sourcemap 是用来 debug 编译后文件的，通过映射到
    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    //
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // 是否在生产环境中压缩代码，如果要压缩必须安装 compression-webpack-plugin
    productionGzip: false,
    // 下面定义要压缩哪些类型的文件
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // 开启编译完成后的报告，可以设置值为 true 和 false 来开启或关闭
    // 下面的 process.env.npm_config_report 表示定义的一个 npm_config_report 环境变量，可以自行设置
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
