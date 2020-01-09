// 此文件是 vue 开发环境的 webpack 相关配置文件，主要用来处理各种文件的配置

'use strict'
// 引入 nodejs 路径模块
const path = require('path')
// 引入 utils.js 文件，主要用来处理 css-loader 和 vue-style-loader
const utils = require('./utils')
// 引入 config 目录下的 index.js 文件，主要用来定义一些开发和生产环境属性
const config = require('../config')
//  引入 vue-loader.conf.js 文件
const vueLoaderConfig = require('./vue-loader.conf')

//  返回当前目录的平行目录的路径，因为有'..'
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    // 入口文件时 src 目录下的 main.js
    app: './src/main.js'
  },
  output: {
    // 路径时 config 目录下的 index.js 中的 build 配置中的 assetsRoot ，也就是 dist 目录
    path: config.build.assetsRoot,
    // 文件名称使用默认的 name ，也就是 main？
    filename: '[name].js',
    // 上线地址。也就是真正的文件的引用路径，如果是 production 生产环境，其实这里都是 '/'
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  // resolve 是 webpack 的内置选项，顾名思义，决定要做的事，也就是说当使用 import "..."时，该如何去执行这件事
  resolve: {
    //import jQuery from "./additional/dist/js/jquery" 这样会很麻烦，可以起个别名简化操作
    // 省略扩展名，也就是说 .js .vue .json 文件导入可以省略后缀名，这会覆盖默认的设置，所以省略扩展名一定要写上
    extensions: ['.js', '.vue', '.json'],
    alias: {
      // 后面的 $ 符号指精确匹配，也就是说只能使用 import vuejs from "vue"，这样的方式导入 vue.esm.js 文件，不能在后面跟上 vue/vue.js
      'vue$': 'vue/dist/vue.esm.js',
      //  resolve('src') 在这里指的就是项目根目录中的 src 目录，使用 import somejs from "@/some.js" 就可以导入指定文件，高大上
      '@': resolve('src'),
    }
  },
  // module 用来解析不同的模块
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        // 对 .vue 文件使用 vue-loader ，该 loader 是 vue 单文件组件的实现核心，专门用来解析 .vue 文件的
        loader: 'vue-loader',
        // 将 vueLoaderConfig 当做参数传递给 vue-loader ，可以解析文件中 css 的相关文件
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        // 对 js 文件 使用 babel-loader 转码，该插件是用来解析 es6 等代码
        loader: 'babel-loader',
        // 指明 src 和 test 目录下的 js 文件要使用该 loader
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        // 对图片相关的文件使用 url-loader 插件，作用是将一个足够小的文件生成一个 64 位的 DataURL
        // 当一个图片足够小，为了避免单独请求，把图片的二进制代码变成 64 位的
        // DataURL，使用src加载，把图片当成一串代码
        loader: 'url-loader',
        options: {
          // 限制 10000 个字节以下的图片才使用 DataURL
          limit: 10000,
          // 详情看(1)
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        // 音频文件处理，和上面一样
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        // 字体文件处理，和上面一样
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

/*(1)
1. 对于文件小于10000byte的，在生成的代码用中base64来替代
2. 大于10000byte的，按[name].[hash:7].[ext]的命名方式放到了static/img下面，方便做cache
3. 因为项目中会有动态引入而无法提前通过loader加载的图片，用CopyWebpackPlugin放到dist目录下。所以最后build完的图片资源就是两部分：一部分是dev下的整个图片文件夹（被复制了一份），另外的就是经过url-loader处理过的dist/img下的，带hash的图片。
*/
