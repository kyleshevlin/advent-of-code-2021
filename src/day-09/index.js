const fs = require('fs')
const path = require('path')
const { decode } = require('punycode')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function createMatrix(map) {
  return map
    .trim()
    .split('\n')
    .map(row => row.split('').map(Number))
}

function partOne(map) {
  const matrix = createMatrix(map)

  const lowPoints = []
  for (const [rowIdx, row] of matrix.entries()) {
    for (const [colIdx, col] of row.entries()) {
      const above = rowIdx > 0 ? matrix[rowIdx - 1][colIdx] : Infinity
      const right =
        colIdx < row.length - 1 ? matrix[rowIdx][colIdx + 1] : Infinity
      const below =
        rowIdx < matrix.length - 1 ? matrix[rowIdx + 1][colIdx] : Infinity
      const left = colIdx > 0 ? matrix[rowIdx][colIdx - 1] : Infinity

      if (col < above && col < right && col < below && col < left) {
        lowPoints.push(col)
      }
    }
  }

  const riskLevels = lowPoints.map(number => number + 1)
  const totalRisk = riskLevels.reduce((acc, cur) => acc + cur, 0)

  return totalRisk
}

const firstAnswer = partOne(data) // 423

module.exports = {
  partOne,
}
