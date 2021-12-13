const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function parseInput(input) {
  let [dots, folds] = input.trim().split('\n\n')
  dots = dots.split('\n').map(pair => pair.split(',').map(Number))
  folds = folds
    .split('\n')
    .map(line => line.replace('fold along ', '').split('='))
    .map(([dir, val]) => [dir, Number(val)])

  return [dots, folds]
}

function makeEmptyGridOf(x, y) {
  const grid = []
  for (let row = 0; row <= y; row++) {
    for (let col = 0; col <= x; col++) {
      if (!grid[row]) grid[row] = []
      grid[row][col] = '.'
    }
  }

  return grid
}

function makeGridFromDots(dots) {
  const maxX = dots.reduce(
    (acc, cur) => (cur[0] > acc ? cur[0] : acc),
    -Infinity
  )
  const maxY = dots.reduce(
    (acc, cur) => (cur[1] > acc ? cur[1] : acc),
    -Infinity
  )

  const grid = makeEmptyGridOf(maxX, maxY)

  dots.forEach(([x, y]) => {
    grid[y][x] = '#'
  })

  return grid
}

function printGrid(grid) {
  const result = grid.map(row => row.join('')).join('\n')
  console.log(result)
}

function applyUpwardFold(grid, rowIdx) {
  const top = grid.slice(0, rowIdx)
  const bottom = grid.slice(rowIdx + 1)
  const flippedBottom = []

  for (const row of bottom) {
    flippedBottom.unshift(row)
  }

  const result = makeEmptyGridOf(top[0].length - 1, top.length - 1)
  for (const [rowIdx, row] of top.entries()) {
    for (const [colIdx, col] of row.entries()) {
      if (col === '#' || flippedBottom[rowIdx][colIdx] === '#') {
        result[rowIdx][colIdx] = '#'
      }
    }
  }

  return result
}

function applyLeftwardFold(grid, colIdx) {
  const left = grid.map(row => row.slice(0, colIdx))
  const right = grid.map(row => row.slice(colIdx + 1))
  const flippedRight = right.map(row => [...row].reverse())

  const result = makeEmptyGridOf(left[0].length - 1, left.length - 1)
  for (const [rowIdx, row] of left.entries()) {
    for (const [colIdx, col] of row.entries()) {
      if (col === '#' || flippedRight[rowIdx][colIdx] === '#') {
        result[rowIdx][colIdx] = '#'
      }
    }
  }

  return result
}

function getDotCount(grid) {
  const dots = grid.flatMap(row => row.filter(col => col === '#'))
  return dots.length
}

function partOne(input) {
  const [dots, folds] = parseInput(input)
  const grid = makeGridFromDots(dots)

  let folded = grid
  folds.forEach(([dir, val], idx) => {
    if (idx >= 1) return

    if (dir === 'x') {
      folded = applyLeftwardFold(folded, val)
    }

    if (dir === 'y') {
      folded = applyUpwardFold(folded, val)
    }
  })

  const result = getDotCount(folded)

  return result
}

const firstAnswer = partOne(data) // 678

function partTwo(input) {}

module.exports = {
  partOne,
  partTwo,
}
