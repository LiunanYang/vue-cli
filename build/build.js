//此文件在 node 环境中运行，使用 webpack 的 nodejsAPI 实现自定义构建和开发流程


'use strict'
// npm 和 node版本检查
require('./check-versions')()

// 设置环境变量为 production
process.env.NODE_ENV = 'production'

// ora 是命令行转圈圈动画插件
const ora = require('ora')
// rimraf 插件是用来执行UNIX命令 rm 和 -rf 的，用来删除文件夹和文件，清空旧文件
const rm = require('rimraf')
// node.js路径模块
const path = require('path')
// chalk插件，在命令行中输入不同颜色的文字
const chalk = require('chalk')
// 引入 webpack 模块使用内置插件和 webpack 方法
const webpack = require('webpack')
// 引入config下的index.js配置文件，配置一些通用的选项
const config = require('../config')
// 下面是生产模式的 webpack 配置文件
const webpackConfig = require('./webpack.prod.conf')

// 开启命令行转圈圈动画
const spinner = ora('building for production...')
spinner.start()

// 调用rm方法，第一个参数的结果就是 dist/static,表示删除这个路径下所有文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  // 如果删除过程中出现错误，就抛出这个错误，同时程序中止
  if (err) throw err
  // 没有错误，就执行 webpack 编译
  webpack(webpackConfig, (err, stats) => {
    // 这个回调函数是 webpack 编译过程中执行
    //停止转圈圈动画
    spinner.stop()
    //如果有错误就抛出错误
    if (err) throw err
    // 没有错误就执行下面的代码，process.stdout.write 和 console.log 类似，输出对象
    process.stdout.write(stats.toString({
      // stats 对象中保存着编译过程中的各种消息
      colors: true,  //增加控制台颜色开关
      modules: false,  //不增加内置模块信息
      // 不增加子级信息
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,  //允许较少的输出
      chunkModules: false   //不将内置模块的信息加到包信息
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)  //node 进程终止 ？
    }

    // 以下是编译成功的消息
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
