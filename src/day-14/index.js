const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function parseInput(input) {
  let [polymerTemplate, pairInsertions] = input.trim().split('\n\n')
  pairInsertions = pairInsertions
    .split('\n')
    .map(item => item.split(' -> '))
    .reduce((acc, [pair, insertion]) => {
      acc[pair] = insertion
      return acc
    }, {})

  return [polymerTemplate, pairInsertions]
}

function applyInsertions(string, insertions) {
  const pairs = []
  for (let i = 0; i < string.length - 1; i++) {
    pairs.push(string[i] + string[i + 1])
  }

  const inserted = pairs.map(pair => {
    if (insertions[pair]) {
      return pair[0] + insertions[pair] + pair[1]
    }
  })

  // This always removes the first character of the next string
  // resulting in the correctly stitched back together string
  const result = inserted.reduce((acc, cur) => {
    return acc + cur.slice(1)
  })

  return result
}

function initZero(obj, key) {
  if (!obj[key]) obj[key] = 0
}

function countChars(string) {
  return [...string].reduce((acc, cur) => {
    initZero(acc, cur)
    acc[cur]++

    return acc
  }, {})
}

function partOne(input) {
  const [polymerTemplate, pairInsertions] = parseInput(input)
  let polymer = polymerTemplate

  for (let i = 0; i < 10; i++) {
    polymer = applyInsertions(polymer, pairInsertions)
  }

  const counts = countChars(polymer)
  const values = Object.values(counts)
  const min = Math.min(...values)
  const max = Math.max(...values)

  return max - min
}

const firstAnswer = partOne(data) // 3230

function makePairHash(str) {
  const result = {}

  for (let i = 0; i < str.length - 1; i++) {
    const key = str[i] + str[i + 1]
    initZero(result, key)
    result[key]++
  }

  return result
}

function makeCharCounts(str) {
  const result = {}

  str.split('').forEach(char => {
    initZero(result, char)
    result[char]++
  })

  return result
}

/**
 * This optimized solution does not track the polymer string. It makes no
 * attempt to maintain the order of the values in the polymer. Rather, it tracks
 * the pairs, updating with each iteration of insertions.
 *
 * To do this, we create a hash of the polymer template's pairs. This will look
 * something like: { NN: 1, NC: 1, CH: 1 } for the string 'NNCH'
 *
 * We also initialize a `charCounts` to track how many of each character there are.
 * This is necessary since we'll never have the whole string to count, and we don't
 * know the order of the pairs to stitch it back together. This will look like:
 * { N: 2, C: 1, H: 1} for the string 'NNCH'
 *
 * `applyInsertion` is the crux of this function, it updates the `pairHash` and
 * `charCounts`. If an insertion is found, we will create a set of `changes` and
 * `inserts` necessary for the next step and apply them all at once after finding
 * all `changes` and `inserts`.
 *
 * It is key to understand that when an `insert` occurs, it creates two pairs
 * and removes the current pair. If I have an insertion rule of 'NC -> B' and
 * apply it to the string 'NNCH', the resulting `pairHash` would now include the
 * pairs 'NB' and 'BC', and would no longer have an 'NC'. { NN: 1, NB: 1, BC: 1, CH: 1}
 */
function optimizedApplyInsertions(template, insertions, iterations) {
  const pairHash = makePairHash(template)
  const charCounts = makeCharCounts(template)
  const insertionEntries = Object.entries(insertions)

  function applyInsertion() {
    const changes = {}
    const inserts = {}

    for (const [pair, insert] of insertionEntries) {
      if (!pairHash[pair]) continue

      const count = pairHash[pair]

      // add the count of the inserted values
      initZero(inserts, insert)
      inserts[insert] += count

      // Get the keys of involved pairs
      const [first, last] = pair
      const leftKey = first + insert
      const rightKey = insert + last

      // Adjust the pair counts accordingly, increase new ones, decrease old ones
      initZero(changes, leftKey)
      initZero(changes, rightKey)
      initZero(changes, pair)
      changes[leftKey] += count
      changes[rightKey] += count
      changes[pair] -= count
    }

    // Apply changes all at once
    Object.entries(changes).forEach(([pair, change]) => {
      initZero(pairHash, pair)
      pairHash[pair] += change
    })

    // Apply inserts all at once
    Object.entries(inserts).forEach(([key, value]) => {
      initZero(charCounts, key)
      charCounts[key] += value
    })

    // Remove unnecessary keys from the pairHash
    Object.entries(pairHash).forEach(([key, value]) => {
      if (!value) delete pairHash[key]
    })
  }

  for (let i = 0; i < iterations; i++) {
    applyInsertion()
  }

  return charCounts
}

function partTwo(input, iterations) {
  const [polymerTemplate, pairInsertions] = parseInput(input)
  const counts = optimizedApplyInsertions(
    polymerTemplate,
    pairInsertions,
    iterations
  )

  const values = Object.values(counts)
  const min = Math.min(...values)
  const max = Math.max(...values)

  return max - min
}

const secondAnswer = partTwo(data, 40) // 3542388214529

module.exports = {
  partOne,
  partTwo,
  optimizedApplyInsertions,
  parseInput,
}
