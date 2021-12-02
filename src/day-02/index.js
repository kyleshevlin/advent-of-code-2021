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

function calculateEndpointSimple(directions) {
  let x = 0
  let y = 0

  for (const [direction, change] of directions) {
    if (direction === 'forward') x += change
    if (direction === 'down') y += change
    if (direction === 'up') y -= change
  }

  return { x, y }
}

function calculateEndpointComplex(directions) {
  let aim = 0
  let x = 0
  let y = 0

  for (const [direction, change] of directions) {
    if (direction === 'forward') {
      x += change
      y += aim * change
    }
    if (direction === 'down') aim += change
    if (direction === 'up') aim -= change
  }

  return { x, y }
}

const { x, y } = calculateEndpointSimple(directions)
const { x: x2, y: y2 } = calculateEndpointComplex(directions)

const firstAnswer = x * y // 1507611
const secondAnswer = x2 * y2 // 1880593125

module.exports = { calculateEndpointComplex, calculateEndpointSimple }
