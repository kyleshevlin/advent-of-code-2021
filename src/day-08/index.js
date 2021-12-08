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

function partOne(signals) {
  return signals
    .map(([, outputs]) => simpleNumberCount(outputs))
    .reduce((acc, cur) => acc + cur, 0)
}

/**
 * Just returns how many 1s, 4s, 7s, or 8s are in a group of patterns,
 * all discoverable by segment length.
 * - Ones have 2 segments
 * - Fours have 4 segments
 * - Sevens have 3 segments
 * - Eights have 7 segments
 *
 * All other numbers have 5 or 6 segments, so they must be deduced in another way
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

const firstAnswer = partOne(signalData) // 288

// Curried function for creating quick getters for the simple numbers
const getNumber = length => patterns => patterns.find(p => p.length === length)
const getOne = getNumber(2)
const getSeven = getNumber(3)
const getFour = getNumber(4)
const getEight = getNumber(7)

function partTwo(signals) {
  // Sorting the strings will make it easier to compare two strings for equality
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
function decipherOutput(signal) {
  const [patterns, output] = signal
  const one = getOne(patterns)
  const seven = getSeven(patterns)
  const four = getFour(patterns)
  const eight = getEight(patterns)

  // There are three segments we can know for certain. Probably could do them all
  // but it's unnecessary. These ones suffice.
  const knownSegments = {
    top: null,
    upperRight: null,
    lowerRight: null,
  }

  // We can know the top segment for certain because we can remove the
  // segments of one from the segments of seven
  knownSegments.top = [...seven].filter(l => !one.includes(l))[0]

  // Six is the only number with 6 segments and only one (not both) of
  // the segments of one
  const [six] = patterns.filter(
    pattern =>
      pattern.length === 6 &&
      [...one].filter(l => pattern.includes(l)).length === 1
  )

  // Now that we know we have six, we can deduce upperRight (missing from six)
  // and then the lower right segment
  knownSegments.upperRight = [...one].filter(l => !six.includes(l))[0]
  knownSegments.lowerRight = [...one].filter(
    l => l !== knownSegments.upperRight
  )[0]

  // Three is the only one with 5 segments and both segments of one
  const [three] = patterns.filter(
    pattern =>
      pattern.length === 5 &&
      pattern.includes(knownSegments.upperRight) &&
      pattern.includes(knownSegments.lowerRight)
  )

  // Two has 5 segments, isn't three (obvs), and has the upper right segment (where
  // five has the lower right segment)
  const [two] = patterns.filter(
    pattern =>
      pattern.length === 5 &&
      pattern !== three &&
      pattern.includes(knownSegments.upperRight)
  )

  // Five has 5 segments and isn't two and three :)
  const [five] = patterns.filter(
    pattern => pattern.length === 5 && pattern !== two && pattern !== three
  )

  // Nine and zero both contain 6 segments, but Nine has the middle segment.
  // This means that nine contains all the segments of four, but zero does not.
  const [nine] = patterns.filter(
    pattern => pattern.length === 6 && [...four].every(l => pattern.includes(l))
  )

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
  partOne,
  partTwo,
}
