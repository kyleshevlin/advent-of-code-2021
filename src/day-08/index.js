const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const signalData = data
  .trim()
  .split('\n')
  .map(line => line.split(' | '))
  .map(([patterns, output]) => [patterns.split(' '), output.split(' ')])

function main(signals) {
  return signals
    .map(([, outputs]) => simpleNumberCount(outputs))
    .reduce((acc, cur) => acc + cur, 0)
}

/**
 * Just returns how many 1s, 4s, 7s, or 8s are in a group of patterns,
 * all discoverable by string length
 */
function simpleNumberCount(patterns) {
  const onesFoursSevensEights = patterns.filter(pattern => {
    switch (pattern.length) {
      case 2:
      case 3:
      case 4:
      case 7:
        return true
      default:
        return false
    }
  })

  return onesFoursSevensEights.length
}

const firstAnswer = main(signalData) // 288

module.exports = {
  main,
}
