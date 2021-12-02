const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const numbers = data.trim().split('\n').map(Number)

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

const answer = increasingValuesCount(numbers) // 1722

module.exports = increasingValuesCount
