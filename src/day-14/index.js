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

function partTwo(input) {}

module.exports = {
  partOne,
  partTwo,
}
