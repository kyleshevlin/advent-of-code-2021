const { completeLine, partOne, partTwo, testLine } = require('./')

test('testLine', () => {
  expect(testLine('()')).toEqual({ result: 'complete' })
  expect(testLine('[]')).toEqual({ result: 'complete' })
  expect(testLine('{}')).toEqual({ result: 'complete' })
  expect(testLine('<>')).toEqual({ result: 'complete' })
  expect(testLine('{()()()}')).toEqual({ result: 'complete' })
  expect(testLine('<([{}])>')).toEqual({ result: 'complete' })
  expect(testLine('[<>({}){}[([])<>]]')).toEqual({ result: 'complete' })
  expect(testLine('(((((((((())))))))))')).toEqual({ result: 'complete' })
  expect(testLine('{()()()')).toEqual({ result: 'incomplete', unclosed: ['{'] })
  expect(testLine('<([{}])')).toEqual({ result: 'incomplete', unclosed: ['<'] })
  expect(testLine('[<>({}){}[([])<>]')).toEqual({
    result: 'incomplete',
    unclosed: ['['],
  })
  expect(testLine('(((((((((()))))))))')).toEqual({
    result: 'incomplete',
    unclosed: ['('],
  })
  expect(testLine('{([(<{}[<>[]}>{[]{[(<()>')).toEqual({
    result: 'corrupted',
    expected: ']',
    found: '}',
  })
  expect(testLine('[[<[([]))<([[{}[[()]]]')).toEqual({
    result: 'corrupted',
    expected: ']',
    found: ')',
  })
  expect(testLine('[{[{({}]{}}([{[{{{}}([]')).toEqual({
    result: 'corrupted',
    expected: ')',
    found: ']',
  })
  expect(testLine('[<(<(<(<{}))><([]([]()')).toEqual({
    result: 'corrupted',
    expected: '>',
    found: ')',
  })
})

test('partOne', () => {
  const data = `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`

  expect(partOne(data)).toEqual(26397)
})

test('completeLine', () => {
  const result = testLine('[({(<(())[]>[[{[]{<()<>>')
  expect(completeLine(result.unclosed)).toEqual('}}]])})]')
})

test('partTwo', () => {
  const data = `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`

  expect(partTwo(data)).toEqual(288957)
})
