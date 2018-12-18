import * as babel from '@babel/core'
import pluginMacros from 'babel-plugin-macros'
import prettier from 'prettier'
import prettierOptions from 'best-prettier-config'

expect.addSnapshotSerializer({
  test(val) {
    return typeof val === 'string'
  },
  print(val) {
    return val
  },
})

function format(code) {
  return prettier.format(code, {
    ...prettierOptions,
    parser: 'babylon',
  })
}

async function run(code) {
  let result = await babel.transformAsync(code, {
    babelrc: false,
    plugins: [pluginMacros],
    filename: __filename,
  })
  return format(result.code).trim()
}

test('YYYY', async () => {
  let input = format(`
    import timestamp from './timestamp.macro'
    let value = timestamp('2018')
  `)
  let code = await run(input)
  expect(code).toMatchInlineSnapshot(`let value = 1514793600000`)
})

test('YYYY-MM', async () => {
  let input = format(`
    import timestamp from './timestamp.macro'
    let value = timestamp('2018-10')
  `)
  let code = await run(input)
  expect(code).toMatchInlineSnapshot(`let value = 1538377200000`)
})

test('YYYY-MM-DD', async () => {
  let input = format(`
    import timestamp from './timestamp.macro'
    let value = timestamp('2018-10-01')
  `)
  let code = await run(input)
  expect(code).toMatchInlineSnapshot(`let value = 1538377200000`)
})

test('YYYY-MM-DDThh:mmTZD', async () => {
  let input = format(`
    import timestamp from './timestamp.macro'
    let value = timestamp('1997-07-16T19:20+01:00')
  `)
  let code = await run(input)
  expect(code).toMatchInlineSnapshot(`let value = 869077200000`)
})

test('throws when passed no argument', () => {
  let input = format(`
    import timestamp from './timestamp.macro'
    let value = timestamp()
  `)
  return expect(run(input)).rejects.toThrowErrorMatchingInlineSnapshot(
    `timestamp.macro requires a string argument`
  )
})

test('throws when passed invalid date format', () => {
  let input = format(`
    import timestamp from './timestamp.macro'
    let value = timestamp('catdog')
  `)
  return expect(run(input)).rejects.toThrowErrorMatchingInlineSnapshot(
    `timestamp.macro did not receive a valid date format`
  )
})
