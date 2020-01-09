// 此配置文件时 vue 开发环境的webpack相关配置文件，主要用来处理 css-loader 和 vue-style-loader

'use strict'
// 引入 nodejs 路径模块
const path = require('path')
// 引入 config 目录下的 index.js配置文件
const config = require('../config')
// 引入 extract-text-webpack-plugin插件，将 css 提取到单独的 css 文件中，详情看(1)
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 引入 pakeage.json文件
const packageConfig = require('../package.json')

exports.assetsPath = function (_path) {
  //如果是生产环境，返回config.build.assetsSubDirectory，否则返回config.build.assetsSubDirectory
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.build.assetsSubDirectory

  // path.join 和 path.posix.join 的区别就是，前者返回的是完整的路径。后者返回的是完整路径的相对根路径
  // 也就是说 path.join 的路径是 C：a/a/b/xiangmu/b,那么path.posix.join 就是 b
  return path.posix.join(assetsSubDirectory, _path)

  // 所以这个方法的作用是返回一个干净的相对根路径
}

// 下面是导出 cssLoader 的相关配置
exports.cssLoaders = function (options) {
  // option如果没值就是空对象
  options = options || {}
  // cssLoader 的基本配置
  const cssLoader = {
    loader: 'css-loader',
    // options 是用来传递传输给 loader 的
    options: {
      // 是否开启 cssmap，默认是 false
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    // 将上面的基础 cssLoader 配置放在一个数组里面
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    // 如果该函数传递了单独的 loader 就加到这个 loaders 数组里面，这个loader 可能是 less，sass 之类的
    if (loader) {
      loaders.push({
        // 加载对应的 loader
        loader: loader + '-loader',
        // Object.assign 是 ES6 的方法，合并对象，浅拷贝
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    // 这个 extract 是自定义的属性，可以定义在 options 里面，主要作用就是当配置为 true，就把文件单独提取，可以在使用的时候单独配置
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
    // 上面 用来返回最终读取和导入 loader，来处理对应类型的文件
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),  // css对应 vue-style-loader 和 css-loader
    postcss: generateLoaders(),  // postcss 对应 vue-style-loader 和 css-loader
    less: generateLoaders('less'),  //less 对应 vue-style-loader 和 css-loader
    sass: generateLoaders('sass', { indentedSyntax: true }),  //sass 对应 vue-style-loader 和 css-loader
    scss: generateLoaders('sass'),  //scss 对应 vue-style-loader 和 css-loader
    stylus: generateLoaders('stylus'),  // stylus 对应 vue-style-loader 和 css-loader
    styl: generateLoaders('stylus')   // styl 对应 vue-style-loader 和 css-loader
  }
}

// Generate loaders for standalone style files (outside of .vue)
// 下面这个主要处理 import 这种方式导入的文件类型的打包，上面的 exports.cssLosders是为这一步服务的
exports.styleLoaders = function (options) {
  const output = []
  // 下面就是生成各种 css 文件的 loader 对象
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    // 把每一种文件的loader都提取出来
    const loader = loaders[extension]
    output.push({
      // 最终把结果 push 到 output 数组中
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

/*
(1)extract-text-webpack-plugin插件是用来将文本从bundle中提取到一个单独的文件中
   基本使用方法如下
   const ExtractTextPlugin = require("extract-text-webpack-plugin");
   module.exports = {
       module: {
           rules: [
               {
                   test: /\.css$/, //主要用来处理css文件
                   use: ExtractTextPlugin.extract({
                       fallback: "style-loader", // fallback表示如果css文件没有成功导入就使用style-loader导入
                       use: "css-loader" // 表示使用css-loader从js读取css文件
                   })
               }
           ],
           plugins: [
               new ExtractTextPlugin("styles.css") //表示生成styles.css文件
           ]
       }
   }
*/
