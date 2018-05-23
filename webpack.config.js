const path = require('path') // 引入‘path’，为了在这里使用绝对路径，避免相对路径在不同系统时出现不必要的问题
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
  target: 'node', //webpack打包出来的内容使用在什么环境下
  // 应用入口
  entry: {
    app: path.join(__dirname, './src/app.js')  // app.js作为打包的入口
  },
  // 输出目录
  output: {
    filename: 'bundle.js',  //name代表entry对应的名字; hash代表 整个app打包完成后根据内容加上hash。一旦整个文件内容变更，hash就会变化
    path: path.join(__dirname, './dist'), // 打包好之后的输出路径
    publicPath: '/public', // 静态资源文件引用时的路径（加在引用静态资源前面的）
    libraryTarget: 'commonjs2' // 打包出来js模块所使用的方案（umd、amd、cmd、commonJS）这里我们使用commonjs2，适用于node端
  },
  // 配置loader
  module: {
    rules: [
      {
        test: /.jsx$/, //使用loader的目标文件。这里是.jsx
        loader: 'babel-loader'
      },
      {
        test: /.(js)$/, //使用loader的目标文件。这里是.js
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, 'node_modules')  // 由于node_modules都是编译过的文件，这里我们不让babel去处理其下面的js文件
        ]
      }
    ]
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, './src/template.html') // 以template.html作为模板文件生成html
    })
  ]
}
