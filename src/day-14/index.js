const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function parseInput(input) {
  let [polymerTemplate, pairInsertions] = input.trim().split('\n\n')
  pairInsertions = pairInsertions.split('\n').map(item => item.split(' -> '))
  pairInsertions = pairInsertions.reduce((acc, [pair, insertion]) => {
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

  const result = inserted.reduce((acc, cur) => {
    return acc + cur.slice(1)
  })

  return result
}

function countChars(string) {
  return [...string].reduce((acc, cur) => {
    if (!acc[cur]) {
      acc[cur] = 0
    }

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
  const [, max] = Object.entries(counts).reduce(
    (acc, cur) => {
      return cur[1] > acc[1] ? cur : acc
    },
    [, -Infinity]
  )
  const [, min] = Object.entries(counts).reduce(
    (acc, cur) => {
      return cur[1] < acc[1] ? cur : acc
    },
    [, Infinity]
  )

  return max - min
}

const firstAnswer = partOne(data) // 3230

function makePairHash(str) {
  const result = {}
  for (let i = 0; i < str.length - 1; i++) {
    const key = str[i] + str[i + 1]
    if (!result[key]) result[key] = 0
    result[key]++
  }
  return result
}

function makeCharCounts(str) {
  const result = {}
  str.split('').forEach(char => {
    if (!result[char]) {
      result[char] = 0
    }

    result[char]++
  })

  return result
}

function optimizedApplyInsertions(template, insertions, applications) {
  const pairHash = makePairHash(template)
  const charCounts = makeCharCounts(template)
  const insertionEntries = Object.entries(insertions)

  function applyInsertion() {
    const changes = {}
    const inserts = {}

    for (const [pair, insert] of insertionEntries) {
      if (!pairHash[pair]) continue

      let count = pairHash[pair]
      const [first, last] = pair
      const leftKey = first + insert
      const rightKey = insert + last

      if (!changes[leftKey]) changes[leftKey] = 0
      if (!changes[rightKey]) changes[rightKey] = 0
      if (!changes[pair]) changes[pair] = 0
      changes[leftKey] += count
      changes[rightKey] += count
      changes[pair] -= count

      if (!inserts[insert]) inserts[insert] = 0
      inserts[insert] += count
    }

    Object.entries(changes).forEach(([pair, change]) => {
      if (!pairHash[pair]) {
        pairHash[pair] = 0
      }

      pairHash[pair] += change
    })

    Object.entries(inserts).forEach(([key, value]) => {
      if (!charCounts[key]) charCounts[key] = 0
      charCounts[key] += value
    })

    Object.entries(pairHash).forEach(([key, value]) => {
      if (!value) delete pairHash[key]
    })
  }

  for (let i = 0; i < applications; i++) {
    applyInsertion()
  }

  return charCounts
}

function partTwo(input, applications) {
  const [polymerTemplate, pairInsertions] = parseInput(input)
  const counts = optimizedApplyInsertions(
    polymerTemplate,
    pairInsertions,
    applications
  )

  const [, max] = Object.entries(counts).reduce(
    (acc, cur) => {
      return cur[1] > acc[1] ? cur : acc
    },
    [, -Infinity]
  )
  const [, min] = Object.entries(counts).reduce(
    (acc, cur) => {
      return cur[1] < acc[1] ? cur : acc
    },
    [, Infinity]
  )

  return max - min
}

const secondAnswer = partTwo(data, 40) // 3542388214529

module.exports = {
  partOne,
  partTwo,
  optimizedApplyInsertions,
  parseInput,
}
