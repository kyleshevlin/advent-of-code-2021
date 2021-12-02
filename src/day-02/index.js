const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const directions = data
  .trim()
  .split('\n')
  .map(line => line.split(' '))
  .map(([direction, change]) => [direction, Number(change)])

function calculateEndpoint(directions) {
  let x = 0
  let y = 0

  for (const [direction, change] of directions) {
    if (direction === 'forward') x += change
    if (direction === 'down') y += change
    if (direction === 'up') y -= change
  }

  return { x, y }
}

const { x, y } = calculateEndpoint(directions)

const firstAnswer = x * y

console.log(firstAnswer)

module.exports = { calculateEndpoint }
