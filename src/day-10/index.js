const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const OPENERS = ['(', '[', '{', '<']
const CLOSERS = [')', ']', '}', '>']

const CLOSE_TO_OPEN_MAP = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
}

const OPEN_TO_CLOSE_MAP = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}

const CHAR_TO_VALUE_MAP = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

function createStack() {
  const stack = []

  return {
    push(x) {
      stack.push(x)
    },
    pop() {
      if (stack.length === 0) {
        return undefined
      }

      return stack.pop()
    },
    get length() {
      return stack.length
    },
    isEmpty() {
      return stack.length === 0
    },
  }
}

function testLine(line) {
  const stack = createStack()

  for (const char of line) {
    if (OPENERS.includes(char)) {
      stack.push(char)
      continue
    }

    if (CLOSERS.includes(char)) {
      const closer = char
      const opener = CLOSE_TO_OPEN_MAP[char]
      const lastOpener = stack.pop()

      if (lastOpener !== opener) {
        return {
          result: 'corrupted',
          expected: OPEN_TO_CLOSE_MAP[lastOpener],
          found: closer,
        }
      }
    }
  }

  if (stack.isEmpty()) {
    return { result: 'complete' }
  }

  const unclosed = []
  while (!stack.isEmpty()) {
    unclosed.push(stack.pop())
  }

  return { result: 'incomplete', unclosed }
}

function partOne(input) {
  const lines = input.trim().split('\n')
  const testedLines = lines.map(testLine)
  const corruptedLines = testedLines.filter(
    ({ result }) => result === 'corrupted'
  )
  const scores = corruptedLines.map(({ found }) => CHAR_TO_VALUE_MAP[found])
  const total = scores.reduce((acc, cur) => acc + cur, 0)

  return total
}

const firstAnswer = partOne(data) // 316851

function completeLine(unclosed) {
  return unclosed.map(char => OPEN_TO_CLOSE_MAP[char]).join('')
}

const SECOND_CHAR_TO_VALUE_MAP = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

function partTwo(input) {
  const lines = input.trim().split('\n')
  const testedLines = lines.map(testLine)
  const incompleteLines = testedLines.filter(
    ({ result }) => result === 'incomplete'
  )
  const closings = incompleteLines.map(({ unclosed }) => completeLine(unclosed))
  const scores = closings.map(closing => {
    let result = 0

    for (const char of closing) {
      result *= 5
      result += SECOND_CHAR_TO_VALUE_MAP[char]
    }

    return result
  })
  const sortedScores = [...scores].sort((a, b) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  })
  const middleIndex = Math.floor(sortedScores.length / 2)

  return sortedScores[middleIndex]
}

const secondAnswer = partTwo(data) // 2182912364

module.exports = {
  completeLine,
  partOne,
  partTwo,
  testLine,
}
