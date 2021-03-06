const fs = require('fs')
const path = require('path')

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

  function getCell(rowIdx, colIdx, guard) {
    return guard ? matrix[rowIdx][colIdx] : Infinity
  }

  const lowPoints = []
  for (const [rowIdx, row] of matrix.entries()) {
    for (const [colIdx, col] of row.entries()) {
      const above = getCell(rowIdx - 1, colIdx, rowIdx > 0)
      const right = getCell(rowIdx, colIdx + 1, colIdx < row.length - 1)
      const below = getCell(rowIdx + 1, colIdx, rowIdx < matrix.length - 1)
      const left = getCell(rowIdx, colIdx - 1, colIdx > 0)

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

const makePoint = (rowIdx, colIdx) => [rowIdx, colIdx]
const p = makePoint

function partTwo(map) {
  const matrix = createMatrix(map)

  function getCell(rowIdx, colIdx, guard) {
    return guard ? matrix[rowIdx][colIdx] : Infinity
  }

  // We're going to store the coordinates of low points this time
  const lowPoints = []
  for (const [rowIdx, row] of matrix.entries()) {
    for (const [colIdx, col] of row.entries()) {
      const above = getCell(rowIdx - 1, colIdx, rowIdx > 0)
      const right = getCell(rowIdx, colIdx + 1, colIdx < row.length - 1)
      const below = getCell(rowIdx + 1, colIdx, rowIdx < matrix.length - 1)
      const left = getCell(rowIdx, colIdx - 1, colIdx > 0)

      if (col < above && col < right && col < below && col < left) {
        lowPoints.push(p(rowIdx, colIdx))
      }
    }
  }

  const visited = {}
  function walkBasin(point) {
    const [rowIdx, colIdx] = point
    const key = `${rowIdx}-${colIdx}`

    if (visited[key]) return []

    visited[key] = true

    const row = matrix[rowIdx]

    if (!row) return []

    const col = row[colIdx]

    if (col === undefined || col === 9) return []

    return [
      col,
      ...walkBasin(p(rowIdx + 1, colIdx)),
      ...walkBasin(p(rowIdx, colIdx + 1)),
      ...walkBasin(p(rowIdx - 1, colIdx)),
      ...walkBasin(p(rowIdx, colIdx - 1)),
    ]
  }

  const basins = lowPoints.map(lowPoint => walkBasin(lowPoint))
  const sizes = basins.map(basin => basin.length)
  const sortedSizes = [...sizes].sort((a, b) => {
    if (a < b) return 1
    if (a > b) return -1
    return 0
  })
  const threeLargest = sortedSizes.slice(0, 3)
  const product = threeLargest.reduce((acc, cur) => acc * cur, 1)

  return product
}

const secondAnswer = partTwo(data) // 1198704

module.exports = {
  partOne,
  partTwo,
}
