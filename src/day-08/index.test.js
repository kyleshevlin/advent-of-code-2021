const { main } = require('./')

test('main', () => {
  const data = [
    'acedgfb',
    'cdfbe',
    'gcdfa',
    'fbcad',
    'dab',
    'cefabd',
    'cdfgeb',
    'eafb',
    'cagedb',
    'ab',
    '|',
    'cdfeb',
    'fcadb',
    'cdfeb',
    'cdbaf',
  ]
  expect(main(data)).toEqual([])
})
