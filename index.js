import fs from 'fs'
import parser from '@babel/parser' //生成ast抽象语法树
import traverse from '@babel/traverse' //遍历语法书
import { transformFromAst } from 'babel-core' //babel核心库，可以对语法进行转换等
import path from 'path'
import ejs from 'ejs'
let id = 0
function createAsset(filePath) {
  // 1. 获取文件的内容

  const source = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  })
  // 2. 获取依赖关系
  const ast = parser.parse(source, {
    sourceType: 'module',
  })
  const deps = []
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      //节点类型是import时执行
      deps.push(node.source.value)
    },
  })
  const { code } = transformFromAst(ast, null, {
    presets: ['env'],
  })
  return {
    filePath,
    code,
    id: id++,
    mapping: {},
    deps,
  }
}

function createGraph() {
  const mainAsset = createAsset('./example/main.js')
  const queue = [mainAsset]
  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(path.resolve('./example', relativePath))
      asset.mapping[relativePath] = child.id
      queue.push(child)
    })
  }
  return queue
}
const graph = createGraph()

function build(graph) {
  const template = fs.readFileSync('./boundle.ejs', { encoding: 'utf-8' })
  const data = graph.map((asset) => {
    const { id, code, mapping } = asset
    return {
      id,
      mapping,
      code,
    }
  })
  //根据ejs 模版生成
  const code = ejs.render(template, { data })
  fs.stat('./dist', (err) => {
    if (err && err.code === 'ENOENT') {
      fs.mkdir('dist', () => {
        fs.writeFileSync('./dist/boundle.js', code)
      })
    }
    fs.writeFileSync('./dist/boundle.js', code)
  })
}
build(graph)