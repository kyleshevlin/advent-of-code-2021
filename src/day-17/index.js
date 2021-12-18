const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function parseTarget(input) {
  const result = input
    .replace('target area: ', '')
    .split(', ')
    .map(range => range.split('=')[1].split('..').map(Number))

  return result
}

function launchProbe(vx, vy, target) {
  let status = 'failure'
  const [xRange, yRange] = target
  let x = 0
  let y = 0
  let maxY = 0

  function step() {
    x += vx
    y += vy
    maxY = Math.max(maxY, y)

    vx = Math.max(vx - 1, 0)
    vy--
  }

  do {
    step()

    if (x >= xRange[0] && x <= xRange[1] && y >= yRange[0] && y <= yRange[1]) {
      status = 'success'
    }
  } while (x <= xRange[1] && y >= yRange[0])

  return { maxY, status }
}

function getMinVx(targetX) {
  let result = 0
  let reached = false

  while (!reached) {
    result++
    let x = 0
    let vx = result

    const step = () => {
      x += vx
      vx = Math.max(vx - 1, 0)
    }

    while (x < targetX && vx !== 0) {
      step()
      if (x >= targetX) {
        reached = true
      }
    }
  }

  return result
}

function partOne(input) {
  const target = parseTarget(input)
  const minVx = getMinVx(target[0][0])
  const maxVx = target[0][1]

  const solutions = []
  for (let i = minVx; i <= maxVx; i++) {
    for (let j = 0; j <= 1000; j++) {
      const result = launchProbe(i, j, target)
      if (result.status === 'success') {
        solutions.push({ maxY: result.maxY, vx: i, vy: j })
      }
    }
  }

  const best = solutions.reduce(
    (acc, cur) => {
      if (cur.maxY > acc.maxY) return cur
      return acc
    },
    { maxY: -Infinity }
  )

  return best.maxY
}

const firstAnswer = partOne(data) // 4753

function partTwo(input) {}

module.exports = {
  partOne,
  partTwo,
}
