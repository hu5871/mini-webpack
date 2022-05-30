import { Compilation } from './Compilation.js'
import { SyncHook, AsyncSeriesHook } from 'tapable'
import path from 'path'
import fs from 'fs'
import ejs from 'ejs'
export class Complier {
  constructor(config) {
    const { entry, output } = config
    this._entry = entry
    this._output = output
    this._config = config
    this._compilation = null
    this._plugins = config.plugins || []

    this.hooks = Object.freeze({
      run: new SyncHook(),
      emit: new AsyncSeriesHook(['complier']),
      done: new AsyncSeriesHook(['stats']),
      initialize: new SyncHook([]),
      thisCompilation: new SyncHook(['compilation']),
      done: new AsyncSeriesHook(['compilation'])
    })
    this.initPlugins()
  }
  initPlugins() {
    const plugins = this._plugins
    plugins.forEach((plugin) => {
      plugin.apply(this)
    })

    this.hooks.initialize.call()
  }

  run() {
    this.hooks.run.call()
    this._compilation = new Compilation({
      loaders: this._config.module?.rules || [],
      entry: this._entry,
    })
    this._compilation.make() //构建依赖
    this.hooks.emit.callAsync(this._compilation, () => {
      console.log('emit  依赖图处理完毕')
    })
    this.emitFiles()
    this.hooks.thisCompilation.call()
    this.hooks.done.callAsync(this._compilation,()=>{
      console.log('done  打包完成')
    })
  }
  async emitFiles() {
    // 获取ejs打包的样版
    const tempaltePath = path.resolve('./utils/boundle.ejs')
    const template = fs.readFileSync(tempaltePath, { encoding: 'utf-8' })
    const data = this._compilation.graph.map((module) => {
      const { id, code, mapping } = module
      return {
        id,
        mapping,
        code,
      }
    })
    const code = ejs.render(template, { data })
    await isExists(this._output.path)
    fs.writeFileSync(path.resolve(this._output.path,this._output.filename),code)
  }
}

function isExists(pathStr) {
  let currentPath = ''
  let pathStrArr = pathStr.split('/')
  if (pathStrArr.length <= 0) {
    throw new Error('webpack config entry cannot be empty ')
  }
  if (pathStrArr[0] === '.' || pathStrArr[0] === '') {
    pathStrArr.shift()
  }
  pathStrArr.forEach(async (p) => {
    currentPath === '' ? (currentPath += `${p}`) : (currentPath += `/${p}`)
    try {
      fs.statSync(currentPath)
    } catch (err) {
      if (err && err.code === 'ENOENT') {
        fs.mkdir(currentPath, () => {})
      }
    }
  })
}
