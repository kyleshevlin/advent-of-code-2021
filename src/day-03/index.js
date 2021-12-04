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

const firstAnswer = gamma * epsilon // 3901196

function getOxygenCountIndex(count) {
  const [zero, one] = Object.values(count)

  if (zero > one) return '0'
  return '1'
}

function getCO2CountIndex(count) {
  const [zero, one] = Object.values(count)

  if (one < zero) return '1'
  return '0'
}

function getRating(rows, getCountIndex) {
  let currentRows = rows
  let currentCounts = getBitCountsPerColumn(rows)
  let colIdx = 0
  const cols = rows[0].length
  let result

  while (colIdx < cols && !result) {
    const count = currentCounts[colIdx]
    const countIdx = getCountIndex(count)

    currentRows = currentRows.filter(row => row[colIdx] === countIdx)

    if (currentRows.length === 1) {
      result = currentRows[0]
      return result
    }

    currentCounts = getBitCountsPerColumn(currentRows)
    colIdx++
  }

  return result
}

const oxygenBitStr = getRating(bits, getOxygenCountIndex).join('')
const co2BitStr = getRating(bits, getCO2CountIndex).join('')
const oxygen = parseInt(oxygenBitStr, 2)
const co2 = parseInt(co2BitStr, 2)

const secondAnswer = oxygen * co2 // 4412188

module.exports = {
  flipBitStr,
  getBitCountsPerColumn,
  getCO2CountIndex,
  getOxygenCountIndex,
  getRating,
  getWinner,
}
