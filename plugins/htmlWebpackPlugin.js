import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
export default class HtmlWebpackPlugin {
  constructor(options) {
    this.userOptions = options || {}
  }
  apply(complier) {
    complier.hooks.initialize.tap('HtmlWebpackPlugin', () => {
      const userOptions = this.userOptions
      const defaultOptions = {
        template: 'auto', //默认
        title: 'mini-Webpack App',
        meta: {},
        filename: 'index.html',
        inject: 'body',
      }
      const options = Object.assign(defaultOptions, userOptions)
      this.options = options
      complier.hooks.thisCompilation.tap('HtmlWebpackPlugin', () => {
        const filename = options.filename
        const outputPath = complier._output.path
        const code = generateHtmlFile(complier, options)

        fs.writeFileSync(path.resolve(outputPath, filename), code)
      })
    })
  }
}
function generateHtmlFile(complier, options) {
  const scriptPath = complier._output.filename
  if (options.template === 'auto') {
    const templateCodeStr = createHtmlTempalte()
    const htmlWebpackPlugin = {
      options: { ...options, scriptPath },
    }
    const code = ejs.render(templateCodeStr, { htmlWebpackPlugin })
    return code
  }
  if (options.template.indexOf('.html')) {
    let code = fs.readFileSync(path.resolve(options.template), {
      encoding: 'utf-8',
    })
    return code
  }
}


function createHtmlTempalte() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
       <meta charset="utf-8"/>
       <title><%= htmlWebpackPlugin.options.title %></title>
      </head>
      <body>
      </body>
      <script src="<%= htmlWebpackPlugin.options.scriptPath %>"></script>
    </html>
    `
}
