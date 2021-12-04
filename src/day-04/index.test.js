const { runGame } = require('./')

test('runGame', () => {
  const board =
    '22 13 17 11  0\n 8  2 23  4 24\n21  9 14 16  7\n 6 10  3 18  5\n 1 12 20 15 19'

  expect(runGame([0, 1, 2, 3, 4], [board])).toEqual(undefined)
  expect(runGame([22, 13, 17, 11, 0], [board])).toBeDefined()
  expect(runGame([22, 8, 21, 6, 1], [board])).toBeDefined()
  const result = runGame([0, 24, 7, 5, 19], [board])
  console.log(JSON.stringify(result, null, 2))
})
