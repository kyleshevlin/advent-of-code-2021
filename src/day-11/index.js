const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const createMatrix = input =>
  input
    .trim()
    .split('\n')
    .map(line => line.split('').map(Number))

const printMatrix = matrix => {
  console.log(matrix.map(line => line.join('')).join('\n'))
}

function createSim(input) {
  const matrix = createMatrix(input)
  let flashes = 0

  function incCell(rowIdx, colIdx) {
    if (rowIdx < 0 || rowIdx > matrix.length - 1) return
    if (colIdx < 0 || colIdx > matrix[rowIdx].length - 1) return

    matrix[rowIdx][colIdx]++
  }

  return {
    tick() {
      for (const [rowIdx, row] of matrix.entries()) {
        for (const [colIdx] of row.entries()) {
          matrix[rowIdx][colIdx]++
        }
      }

      let hadAFlash = false
      let flashedMap = {}
      do {
        hadAFlash = false

        for (const [rowIdx, row] of matrix.entries()) {
          for (const [colIdx, col] of row.entries()) {
            const key = `${rowIdx}-${colIdx}`

            if (!flashedMap[key] && col > 9) {
              hadAFlash = true
              flashes++
              flashedMap[key] = true

              // Increment neighbors
              incCell(rowIdx - 1, colIdx - 1)
              incCell(rowIdx - 1, colIdx)
              incCell(rowIdx - 1, colIdx + 1)
              incCell(rowIdx, colIdx - 1)
              incCell(rowIdx, colIdx + 1)
              incCell(rowIdx + 1, colIdx - 1)
              incCell(rowIdx + 1, colIdx)
              incCell(rowIdx + 1, colIdx + 1)
            }
          }
        }
      } while (hadAFlash)

      for (const key of Object.keys(flashedMap)) {
        const [rowIdx, colIdx] = key.split('-')
        matrix[rowIdx][colIdx] = 0
      }

      // printMatrix(matrix)
      return matrix
    },
    get matrix() {
      return matrix
    },
    get flashes() {
      return flashes
    },
  }
}

function partOne(input, ticks = 1) {
  const sim = createSim(input)

  for (let i = 0; i < ticks; i++) {
    sim.tick()
  }

  return sim.flashes
}

const firstAnswer = partOne(data, 100) // 1743

function partTwo(input) {}

const secondAnswer = partTwo(data) // 2182912364
module.exports = {
  partOne,
  partTwo,
}
