const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const [numStrs, ...boards] = data.split('\n\n')
const numbers = numStrs.split(',').map(Number)

function parseBoard(board) {
  const parsedBoard = board
    .split('\n')
    .filter(Boolean)
    .map(row =>
      row
        .split(/\s/)
        .filter(Boolean)
        .map(Number)
        .map(num => ({ value: num, isMarked: false }))
    )

  const index = {}
  for (const item of parsedBoard.flat()) {
    index[item.value] = item
  }

  return { board: parsedBoard, index }
}

// This is a mutation, be careful
function updateBoard(board, number) {
  if (board.index[number]) {
    board.index[number].isMarked = true
  }
}

function checkForWin(board) {
  const cols = board[0].length

  for (const row of board) {
    if (row.every(item => item.isMarked)) return true
  }

  let colIdx
  for (colIdx = 0; colIdx < cols; colIdx++) {
    const items = board.map(row => row[colIdx])
    if (items.every(item => item.isMarked)) return true
  }

  return false
}

function runGame(nums, brds) {
  const parsedBoards = brds.map(parseBoard)

  for (const num of nums) {
    for (const board of parsedBoards) {
      updateBoard(board, num)
      const result = checkForWin(board.board)
      if (result) {
        return { num, board }
      }
    }
  }
}

const bingo = runGame(numbers, boards)

function sumUnmarkedNumbers(board) {
  return board
    .flat()
    .filter(item => !item.isMarked)
    .reduce((acc, item) => acc + item.value, 0)
}

const unmarkedSum = sumUnmarkedNumbers(bingo.board.board)

const firstAnswer = bingo.num * unmarkedSum // 25410

console.log(firstAnswer)

module.exports = { runGame }
