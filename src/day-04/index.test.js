const { runGame, runSecondGame } = require('./')

test('runGame', () => {
  const board =
    '22 13 17 11  0\n 8  2 23  4 24\n21  9 14 16  7\n 6 10  3 18  5\n 1 12 20 15 19'

  expect(runGame([0, 1, 2, 3, 4], [board])).toEqual(undefined)
  expect(runGame([22, 13, 17, 11, 0], [board])).toBeDefined()
  expect(runGame([22, 8, 21, 6, 1], [board])).toBeDefined()
})

test('runSecondGame', () => {
  const numbers =
    '7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1'
      .split(',')
      .map(Number)
  const board1 =
    '22 13 17 11  0\n 8  2 23  4 24\n21  9 14 16  7\n 6 10  3 18  5\n 1 12 20 15 19'
  const board2 =
    ' 3 15  0  2 22\n 9 18 13 17  5\n19  8  7 25 23\n20 11 10 24  4\n14 21 16 12  6'
  const board3 =
    '14 21 17 24  4\n10 16 15  9 19\n18  8 23 26 20\n22 11 13  6  5\n 2  0 12  3  7'

  const result = runSecondGame(numbers, [board1, board2, board3])

  expect(result.num).toEqual(13)
  // Verifying it's board 2
  expect(result.board.board[0][0].value).toEqual(3)
})
