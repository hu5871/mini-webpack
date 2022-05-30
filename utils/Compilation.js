import { parse } from './parse.js'
import fs from 'fs'
import path from 'path'

let id=0
export class Compilation {
  constructor({ loaders, entry }) {
    this._loaders = loaders || []
    this._entry = entry
    this.graph = []
  }
  make() {
    const self = this
    function _buildModule(filePath) {
      // 1.获取模块文件的内容
      let source = fs.readFileSync(filePath, {
        encoding: 'utf-8',
      })
      // 调用loader，根据规则处理文件
      self._loaders.forEach(({test, use}) => {
        if (test.test(filePath)) {
          if (Array.isArray(use)) {
            use.reverse().forEach((loader) => {
              source = loader(source)
            })
          } else {
            source = use(source)
          }
        }
      })
      //2.获取模块的依赖并把import换成require
      const { code, dependencies } = parse(source)

      return {
        filePath,
        code,
        id: id++,
        mapping: {},
        dependencies,
      }
    }
    function createGraph(entry) {
      const entryModule = _buildModule(self._entry)
      const queue = [entryModule]
      const targetDir=entry.split('/').filter(dir=> dir.lastIndexOf('.')===-1).join('/')
      for (const asset of queue) {
        asset.dependencies.forEach((relativePath) => {
         const dirPath=path.resolve(targetDir, relativePath)
          const child = _buildModule(dirPath)
          asset.mapping[relativePath] = child.id
          queue.push(child)
        })
      }
      return queue
    }
    this.graph=createGraph(this._entry)
  }
}


