const fs = require('fs')
const path = require('path')
const { decode } = require('punycode')

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

const getNumber = length => patterns => patterns.find(p => p.length === length)
const getOne = getNumber(2)
const getSeven = getNumber(3)
const getFour = getNumber(4)
const getEight = getNumber(7)

function partTwo(signals) {
  const sortedSignals = signals.map(([patterns, outputs]) => {
    const sortedPatterns = patterns.map(p => [...p].sort().join(''))
    const sortedOutputs = outputs.map(o => [...o].sort().join(''))

    return [sortedPatterns, sortedOutputs]
  })

  const decodedOutputValues = sortedSignals.map(signal =>
    decipherOutput(signal)
  )

  const result = decodedOutputValues.reduce((acc, cur) => acc + cur, 0)

  return result
}

/**
 * Well, it works 😅
 */
function decipherOutput([patterns, output]) {
  const one = getOne(patterns)
  const seven = getSeven(patterns)
  const four = getFour(patterns)
  const eight = getEight(patterns)

  const knownSegments = {
    top: null,
    upperRight: null,
    lowerRight: null,
  }

  // We can know the top for certain because we can remove the segments of one
  // from seven
  knownSegments.top = [...seven].filter(l => !one.includes(l))[0]

  // 6 is the only number with 6 segments, and only one of the segments of one
  const six = patterns.filter(
    pattern =>
      pattern.length === 6 &&
      [...one].filter(l => pattern.includes(l)).length === 1
  )[0]

  knownSegments.upperRight = [...one].filter(l => !six.includes(l))[0]
  knownSegments.lowerRight = [...one].filter(
    l => l !== knownSegments.upperRight
  )[0]

  // Three is the only one of length 5 with both the segments of one
  const three = patterns.filter(
    pattern =>
      pattern.length === 5 &&
      pattern.includes(knownSegments.upperRight) &&
      pattern.includes(knownSegments.lowerRight)
  )[0]

  // Two is of length 5, isn't three (which has the lower right segment) and
  // has the upper right segment
  const two = patterns.filter(
    pattern =>
      pattern.length === 5 &&
      pattern !== three &&
      pattern.includes(knownSegments.upperRight)
  )[0]

  // Five is of length 5 and isn't two and three
  const five = patterns.filter(
    pattern => pattern.length === 5 && pattern !== two && pattern !== three
  )[0]

  // Nine is different than zero because it contains the middle (all the
  // segments of four) and zero is missing one of four's segments
  const nine = patterns.filter(
    pattern => pattern.length === 6 && [...four].every(l => pattern.includes(l))
  )[0]

  const decipheredOutputs = output.map(val => {
    if (val === one) return 1
    if (val === two) return 2
    if (val === three) return 3
    if (val === four) return 4
    if (val === five) return 5
    if (val === six) return 6
    if (val === seven) return 7
    if (val === eight) return 8
    if (val === nine) return 9

    return 0
  })

  return Number(decipheredOutputs.join(''))
}

const secondAnswer = partTwo(signalData) // 940724

module.exports = {
  decipherOutput,
  main,
  partTwo,
}
