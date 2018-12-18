import { createMacro, MacroError } from 'babel-plugin-macros'
import { parse, getTime } from 'date-fns'

export default createMacro(timestampMacro)

function timestampMacro({ references, babel }) {
  Object.keys(references).forEach(key => {
    let referenceArray = references[key]
    referenceArray.forEach(({ parentPath }) => {
      let value = getValue(parentPath.node)
      if (value) {
        let timestamp = getTime(parse(value))
        if (Number.isNaN(timestamp)) {
          throw new MacroError(
            'timestamp.macro did not receive a valid date format'
          )
        } else {
          parentPath.replaceWith(babel.types.numericLiteral(timestamp))
        }
      } else {
        throw new MacroError('timestamp.macro requires a string argument')
      }
    })
  })
}

function getValue(node) {
  if (node.type === 'CallExpression') {
    let firstArg = node.arguments[0]
    return firstArg ? firstArg.value : undefined
  }
  if (node.type === 'TaggedTemplateExpression') {
    return node.quasi.quasis[0].value.cooked
  }
  return undefined
}
