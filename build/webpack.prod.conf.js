// 此文件是 webpack 生产环境的核心配置文件

'use strict'
// 引入 nodejs 路径模块
const path = require('path')
// utils.js ，主要处理 css 类文件的loader ，css-loader，vue-style-loader
const utils = require('./utils')
// 引入 webpack ，使用 webpack 内置插件
const webpack = require('webpack')
// 引入 config 目录下的 index.js 配置文件，定义了生产和开发环境的相关基础配置
const config = require('../config')
// 引入 webpack 的 merger 插件，主要用来处理对象合并的，可以将一个大的配置对象拆分成几个小的，合并，相同的项将覆盖
const merge = require('webpack-merge')
// 用来处理不同文件的 loader 配置
const baseWebpackConfig = require('./webpack.base.conf')
// copy-webpack-plugin 插件 用来复制指定文件或者文件夹到指定目录
const CopyWebpackPlugin = require('copy-webpack-plugin')
// html-webpack-plugin 生成 HTML 文件，可以设置模板
const HtmlWebpackPlugin = require('html-webpack-plugin')
// extract-text-webpack-plugin 将 bundle 中的 css 等文件产出单独的 bundle 文件的，之前也详细讲过
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// optimize-css-assets-webpack-plugin 插件是压缩 css 代码的，还能去掉 extract-text-webpack-plugin 插件抽离文件产生的重复代码，因为同一个 css 可能在多个模块中出现所以会导致重复代码。这两个插件是两兄弟。
// 详情看(1)
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
//uglifyjs-webpack-plugin插件 用来压缩优化 js 文件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


// 判断当前环境变量的值是否为 testing ，是的话导入 test.env.js 配置文件，设置 env 为 testing
// 不是的话，设置 env 为 production
const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')

// 把当前的配置对象和基础的配置对象合并
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    // 下面就是把 utils 配置好的处理各种 css 类型的配置拿过来，和 dev 设置一样，就是这里多了个 extract：true
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true, //自定义项，设置为 true 表示 生成独立的文件
      usePostCSS: true
    })
  },
  // devtool 开发工具，用来生成个 sourcemap 方便调试
  // 按理说这里不用生成 sourcemap ,这里生成了 source-map 类型的 map 文件，只用于生产环境
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    // 打包后的文件放在 dist 目录里面
    path: config.build.assetsRoot,
    // 文件名称使用 static/js/[name].[chunkhash].js
    // name 是 main ，chunkhash 是模块的 hash 值，用于浏览器缓存
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // chunkFilename 是非入口模块文件，filename 文件中引用了 chunkFilename
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // 下面利用 DefinePlugin 插件，定义 process.env 环境变量为 env
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 压缩 js 文件的插件
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          // 禁止压缩时候的警告信息，给用户一种 vue 没有错误的感觉
          warnings: false
        }
      },
      // 压缩后生成的 map 文件
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      // 生成独立的 css 文件，下面是 生成的独立 css 文件的名称
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      // 压缩 css 文件
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // 生成 html 页面
    new HtmlWebpackPlugin({
      // 判断是否是测试环境，是的话....？
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,   // path.resolve(__dirname, '../dist/index.html')
      // 模板是 index.html
      template: 'index.html',
      // 将 js 文件放到 body 标签的结尾
      inject: true,
      minify: {
        // 压缩产出后的 html 页面
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // 分类要插到 html 页面的模块
      chunksSortMode: 'dependency'
    }),

    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    // 下面的插件是将打包后的文件中的第三方库文件抽取出来，便于浏览器缓存，提高程序运行速度
    new webpack.optimize.CommonsChunkPlugin({
      // common 模块名称
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        //  将所有依赖于 node_modules 下面文件打包到 vendor 中
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 把 webpack 的 runtime 代码和 module mainfest 代码提取到 manifest 文件中，防止修改了代码但是没有修改第三方库文件导致第三方库文件也打包的问题
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    // 下面是复制文件的插件，博主认为在这里并不是起到复制文件的作用，而是过滤打包过程中产生的以 . 开头的文件
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  // 开启 Gzi 压缩打包后的文件？
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(  // 把 js 和 css 文件压缩
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  // 打包编译后的文件打印出详细的文件信息，vue-cli把这个禁用了，博主觉得有用，可以自行配置
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig


/**(1)
    optimize-css-assets-webpack-plugin插件
   在生产环境中使用extract-text-webpack-plugin，最好也使用这个插件
   使用方法如下
   安装 npm install --save-dev optimize-css-assets-webpack-plugin
   还要安装 cssnano 这是一个css编译器 npm install --save-dev cssnano 这个vue-cli脚手架并没有使用cssnano，但是这个插件的官方说要安装cssnano，这是不是一个bug??
   new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.optimize\.css$/g, // 不写默认是/\.css$/g
        cssProcessor: require('cssnano'), // 编译器选项，不写默认是cssnano，所以使用这个插件不管怎样都要cssnano
        cssProcessorOptions: { discardComments: {removeAll: true } }, // 传递给编译器的参数
        canPrint: true // 是否能够输出信息
   })

 */
