import pluginTester from 'babel-plugin-tester'
import plugin from 'babel-plugin-macros'
import prettier from 'prettier'
import prettierOptions from 'best-prettier-config'

let format = code => prettier.format(code, prettierOptions)

pluginTester({
  plugin,
  pluginName: 'timestamp.macro',
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: [
    format(`
      import timestamp from './timestamp.macro'
      let value = timestamp('2018-10-01')
    `),
  ],
})
