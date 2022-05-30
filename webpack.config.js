import { jsonLoader } from './loader/jsonLoader.js'
import HtmlWebpackPlugin from './plugins/htmlWebpackPlugin.js'
const webpackConfig = {
  entry: './example/main.js',
  output: {
    filename: 'boundle.js',
    path: './dist',
  },
  module: {
    //loader实际的作用就是让webpack能够处理非js文件（webpack自身只理解js）
    // 一个loader应该只去处理一件事
    rules: [
      {
        test: /\.json$/,
        use: [jsonLoader],
      },
    ],
  },
  plugins: [
    //插件,在webpack的构建过程中，会在特定的时机广播事件,plugin只需要在对应的钩子（事件回调）函数中完成想要的操作
    new HtmlWebpackPlugin({
    }),
  ],
}

export default webpackConfig