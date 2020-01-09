'use strict'
// utils 配置文件解决 css 相关文件 loader
const utils = require('./utils')
// 生产和开发环境的相关属性
const config = require('../config')
// 判断当前是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction  //自定义配置项，设置为 true 表示生成单独样式文件
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
