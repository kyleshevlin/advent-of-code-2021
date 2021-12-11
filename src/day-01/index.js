const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const numbers = data.trim().split('\n').map(Number)

/**
 * Named after the purpose in the puzzle, this function takes an array of
 * numbers and sums 3 numbers at a time in a sliding window. So the first
 * sum is of indexes 0, 1, and 2, the next sum is indexes 1, 2, 3, the next
 * sum is indexes 2, 3, 4 and so on.
 */
function convertToSlidingWindows(numbers) {
  let [a, b, ...otherNumbers] = numbers
  const sums = []

  for (const number of otherNumbers) {
    const sum = a + b + number
    sums.push(sum)

    a = b
    b = number
  }

  return sums
}

/**
 * This function receives an array of numbers and determines if the current
 * value is greater than the previous value, incrementing a count each time
 */
function increasingValuesCount(values) {
  const [firstValue, ...otherValues] = values
  let count = 0
  let previousValue = firstValue

  for (const value of otherValues) {
    if (value > previousValue) count++
    previousValue = value
  }

  return count
}

const firstAnswer = increasingValuesCount(numbers) // 1722
const secondAnswer = increasingValuesCount(convertToSlidingWindows(numbers)) // 1748

module.exports = { convertToSlidingWindows, increasingValuesCount }
