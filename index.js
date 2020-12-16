const fs = require('fs')
const acorn = require("acorn")
const walk = require("acorn-walk")
const path = require('path')

const warningPath = path.resolve(process.cwd(), "warnings")
const errorPath = path.resolve(process.cwd(), "errors")


const REACT_PATH = 'react/cjs/react.development.js'
const REACT_DOM_PATH = 'react-dom/cjs/react-dom.development.js'
const REACT_JSX_RUN_TIME_PATH = 'react/cjs/react-jsx-runtime.development.js'

fs.writeFileSync(warningPath, "")
fs.writeFileSync(errorPath, "")

const getWarningAndErros = filepath => {
  fs.writeFileSync(warningPath, filepath + "\n\n", { flag: 'a+' })
  fs.writeFileSync(errorPath, filepath + "\n\n", { flag: 'a+' })

  const content = fs.readFileSync(require.resolve(filepath), 'utf8')

  walk.simple(acorn.parse(content, { ecmaVersion: 'latest' }), {
    'CallExpression': (node) => {
      const { name, type, start, end } = node.callee
      if (type === 'Identifier') {
        const arg = content.slice(end, node.end)
        if (name === 'warn') {
          fs.writeFileSync(warningPath, `${arg}\n`, {
            flag: 'a+'
          })
        } else if (name === 'error') {
          fs.writeFileSync(errorPath, `${arg}\n`, {
            flag: 'a+'
          })
        }
      }
    }
  })

  fs.writeFileSync(warningPath, "\n\n", { flag: 'a+' })
  fs.writeFileSync(errorPath, "\n\n", { flag: 'a+' })
}

console.log(getWarningAndErros(REACT_PATH))
console.log(getWarningAndErros(REACT_DOM_PATH))
console.log(getWarningAndErros(REACT_JSX_RUN_TIME_PATH))