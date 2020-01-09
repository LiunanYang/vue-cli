// 此文件用来检测 node 和 npm 版本

'use strict'
//  chalk插件，在控制台中输出不同颜色的字，只能改变命令行中字体的颜色，用法：chalk.red('yy')
const chalk = require('chalk')
// semver插件，对特定的版本号做判断，比如：
/*
semver.gt('1.2.3','9.8.7')   false 1.2.3版本比9.8.7版本低
*/
const semver = require('semver')
// 下面是导入 package.json 文件，要使用里面的 engines 选项，要注意 require 是直接可以导入 json 文件的，并且 require 返回的就是 json 对象
const packageConfig = require('../package.json')
// shelljs插件，执行 Unix 系统命令
const shell = require('shelljs')
// 下面设计很多 Unix 命令
function exec (cmd) {
  // 脚本可以通过 child_process 模块新建子进程，从而执行 Unix 系统命令
  // 下面这段代码实际就是把 cmd 这个参数传递的值转化成前后没有空格的字符串，也就是版本号
  return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [
  {
    name: 'node',  //node 版本的信息
    // 使用 semver 插件把版本信息转化成规定格式，v1.2.3->1.2.3
    currentVersion: semver.clean(process.version),
    // 这是规定的 pakeage.json 中的 engines 选项的 node 版本信息
    versionRequirement: packageConfig.engines.node
  }
]

//  检查控制太是否可以允许 'npm' 开头的命令
if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    // 自动调用 npm --version命令，并把参数返回给 exec 函数，从而获取纯净的版本号
    currentVersion: exec('npm --version'),
    // 这是规定的 pakeage.json 中的 engines 选项的 node 版本信息 "npm"
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    // 判断如果版本号不符合 pakeage.json 文件中指定的版本号，就执行下面的代码
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      // 把当前版本号用红色字体，符合要求的版本号用绿色字体，给用户提示具体的版本
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1)
    // 提示用户更新版本
  }
}
