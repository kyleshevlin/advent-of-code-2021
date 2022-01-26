const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function parseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(r => r.split(''))
}

function createSim(input) {
  const state = parseInput(input)

  return {
    tick() {
      const horizontalOps = []

      for (const [rowIdx, row] of state.entries()) {
        for (const [colIdx, col] of row.entries()) {
          const nextColIdx = colIdx === state[0].length - 1 ? 0 : colIdx + 1

          if (col === '>' && row[nextColIdx] === '.') {
            // create an op to swap them.
            horizontalOps.push({ rowIdx, colIdx })
          }
        }
      }

      for (const op of horizontalOps) {
        const nextColIdx = op.colIdx === state[0].length - 1 ? 0 : op.colIdx + 1

        state[op.rowIdx][op.colIdx] = '.'
        state[op.rowIdx][nextColIdx] = '>'
      }

      const verticalOps = []

      for (const [rowIdx, row] of state.entries()) {
        for (const [colIdx, col] of row.entries()) {
          const nextRowIdx = rowIdx === state.length - 1 ? 0 : rowIdx + 1

          if (col === 'v' && state[nextRowIdx][colIdx] === '.') {
            // create an op to swap them.
            verticalOps.push({ rowIdx, colIdx })
          }
        }
      }

      for (const op of verticalOps) {
        const nextRowIdx = op.rowIdx === state.length - 1 ? 0 : op.rowIdx + 1

        state[op.rowIdx][op.colIdx] = '.'
        state[nextRowIdx][op.colIdx] = 'v'
      }

      return this
    },
    print() {
      return state.map(row => row.join('')).join('\n')
    },
  }
}

function partOne(input) {
  const sim = createSim(input)
  let changed = false
  let previous = sim.print()
  let count = 0

  do {
    count++
    sim.tick()
    changed = previous !== sim.print()
    previous = sim.print()
  } while (changed)

  return count
}

const firstAnswer = partOne(data)
console.log(firstAnswer)

function partTwo(input) {}

module.exports = {
  createSim,
  partOne,
  partTwo,
}
