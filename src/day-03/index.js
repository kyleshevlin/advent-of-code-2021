const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const bits = data
  .trim()
  .split('\n')
  .map(str => str.split(''))

function getBitCountsPerColumn(rows) {
  const cols = rows[0].length
  let rowIdx
  let colIdx = 0
  const counts = {}

  while (colIdx < cols) {
    counts[colIdx] = { 0: 0, 1: 0 }

    for (rowIdx = 0; rowIdx < rows.length; rowIdx++) {
      const value = rows[rowIdx][colIdx]
      counts[colIdx][value]++
    }

    colIdx++
  }

  return counts
}

const counts = getBitCountsPerColumn(bits)

console.log(counts, Object.values(counts))

function getWinner(count) {
  const [zero, one] = Object.values(count)
  return zero > one ? '0' : '1'
}

const winners = Object.values(counts).map(getWinner)
const gammaStr = winners.join('')

function flipBitStr(bitStr) {
  return bitStr
    .split('')
    .map(Number)
    .map(bit => (bit ? '0' : '1'))
    .join('')
}

const epsilonStr = flipBitStr(gammaStr)
const gamma = parseInt(gammaStr, 2)
const epsilon = parseInt(epsilonStr, 2)

const firstAnswer = gamma * epsilon

console.log(firstAnswer)

module.exports = { flipBitStr, getBitCountsPerColumn, getWinner }
