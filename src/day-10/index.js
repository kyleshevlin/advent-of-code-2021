const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const OPENS = ['(', '[', '{', '<']
const CLOSERS = [')', ']', '}', '>']

const CLOSE_OPEN_MAP = {
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
    debug() {
      console.log(stack)
    },
    push(x) {
      stack.push(x)
    },
    pop() {
      if (stack.length === 0) {
        return undefined
      }

      return stack.pop()
    },
    peek() {
      if (stack.length === 0) {
        return undefined
      }

      return stack[stack.length - 1]
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
    if (OPENS.includes(char)) {
      stack.push(char)
    }

    if (CLOSERS.includes(char)) {
      const closer = char
      const opener = CLOSE_OPEN_MAP[char]
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

  return { result: 'incomplete' }
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

function partTwo() {}

module.exports = {
  partOne,
  partTwo,
  testLine,
}
