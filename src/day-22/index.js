const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function parseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(line => {
      const [setting, ranges] = line.split(' ')
      const [xRange, yRange, zRange] = ranges
        .split(',')
        .map(range => range.slice(2))
        .map(range => range.split('..').map(Number))

      return { setting, xRange, yRange, zRange }
    })
}

function isOutsideInitPlane([min, max]) {
  return (min < -50 && max < -50) || (min > 50 && max > 50)
}

function isOutsideInitRange(xRange, yRange, zRange) {
  return (
    isOutsideInitPlane(xRange) ||
    isOutsideInitPlane(yRange) ||
    isOutsideInitPlane(zRange)
  )
}

function createBox() {
  const box = {}

  return {
    update(instruction) {
      const { setting, xRange, yRange, zRange } = instruction
      const settingValue = setting === 'on' ? 1 : 0

      if (isOutsideInitRange(xRange, yRange, zRange)) {
        return
      }

      for (let x = xRange[0]; x <= xRange[1]; x++) {
        for (let y = yRange[0]; y <= yRange[1]; y++) {
          for (let z = zRange[0]; z <= zRange[1]; z++) {
            const key = [x, y, z].join()
            box[key] = settingValue
          }
        }
      }
    },
    state() {
      return box
    },
  }
}

function partOne(input) {
  const instructions = parseInput(input)
  // The "box" seems too big to make the full thing, even as a Map or Object
  // So to get around this, since we know everything is off at the start, let's
  // just track the changes the instructions give and assume the rest
  const box = createBox()

  instructions.forEach(instruction => {
    box.update(instruction)
  })

  return Object.values(box.state()).filter(val => val === 1).length
}

const firstAnswer = partOne(data) // 623748

function partTwo(input) {}

module.exports = {
  partOne,
  partTwo,
}
