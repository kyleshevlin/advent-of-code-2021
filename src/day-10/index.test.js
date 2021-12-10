const { partOne, partTwo, testLine } = require('./')

test('testLine', () => {
  expect(testLine('()')).toEqual({ result: 'complete' })
  expect(testLine('[]')).toEqual({ result: 'complete' })
  expect(testLine('{}')).toEqual({ result: 'complete' })
  expect(testLine('<>')).toEqual({ result: 'complete' })
  expect(testLine('{()()()}')).toEqual({ result: 'complete' })
  expect(testLine('<([{}])>')).toEqual({ result: 'complete' })
  expect(testLine('[<>({}){}[([])<>]]')).toEqual({ result: 'complete' })
  expect(testLine('(((((((((())))))))))')).toEqual({ result: 'complete' })
  expect(testLine('{()()()')).toEqual({ result: 'incomplete' })
  expect(testLine('<([{}])')).toEqual({ result: 'incomplete' })
  expect(testLine('[<>({}){}[([])<>]')).toEqual({ result: 'incomplete' })
  expect(testLine('(((((((((()))))))))')).toEqual({ result: 'incomplete' })
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

xtest('partTwo', () => {
  const data = ``

  expect(partTwo(data)).toEqual(1134)
})
