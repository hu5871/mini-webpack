import parser from '@babel/parser' //生成ast抽象语法树
import traverse from '@babel/traverse' //遍历语法书
import { transformFromAst } from 'babel-core' //babel核心库，可以对语法进行转换等

export function parse(source){
  // 2. 获取依赖关系
  const ast = parser.parse(source, {
    sourceType: 'module'
  })
  const dependencies = []
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      //节点类型是import时执行
      dependencies.push(node.source.value)
    },
  })
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })
  return {
    code,
    dependencies
  }
}