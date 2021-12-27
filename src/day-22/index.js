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

// The "box" seems too big to make the full thing, even as a Map or Object
// So to get around this, since we know everything is off at the start, let's
// just track the changes the instructions give and assume the rest
function naiveSolution(instructions) {
  const box = createBox()

  instructions.forEach(instruction => {
    box.update(instruction)
  })

  return Object.values(box.state()).filter(val => val === 1).length
}

function partOne(input) {
  const instructions = parseInput(input)
  return naiveSolution(instructions)
}

const firstAnswer = partOne(data) // 623748

function createCuboid({ setting, xRange, yRange, zRange }) {
  return {
    setting,
    x1: xRange[0],
    x2: xRange[1],
    y1: yRange[0],
    y2: yRange[1],
    z1: zRange[0],
    z2: zRange[1],
  }
}

function cuboidVolume(cube) {
  const { x1, x2, y1, y2, z1, z2 } = cube
  return (x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1)
}

/**
 * This function recursively subtracts the volume of any future intersection
 * that would overwrite its current volume. Why? Because this leaves us with
 * only the volume that this cuboid adds to the total.
 */
function futureVolumeOverwrites(cuboid, otherCuboids) {
  const volumes = otherCuboids.map((otherCuboid, idx) => {
    const intersection = intersectingCuboid(cuboid, otherCuboid)

    if (!intersection) return 0

    return (
      cuboidVolume(intersection) -
      futureVolumeOverwrites(intersection, otherCuboids.slice(idx + 1))
    )
  })

  const result = volumes.reduce((x, y) => x + y, 0)

  return result
}

function intersectingCuboid(cubeA, cubeB) {
  const x1 = Math.max(cubeA.x1, cubeB.x1)
  const x2 = Math.min(cubeA.x2, cubeB.x2)
  if (x1 > x2) return

  const y1 = Math.max(cubeA.y1, cubeB.y1)
  const y2 = Math.min(cubeA.y2, cubeB.y2)
  if (y1 > y2) return

  const z1 = Math.max(cubeA.z1, cubeB.z1)
  const z2 = Math.min(cubeA.z2, cubeB.z2)
  if (z1 > z2) return

  return createCuboid({
    setting: cubeB.setting,
    xRange: [x1, x2],
    yRange: [y1, y2],
    zRange: [z1, z2],
  })
}

function partTwo(input) {
  const instructions = parseInput(input)
  const cuboids = instructions.map(createCuboid)

  let totalVolume = 0
  for (const [idx, cuboid] of cuboids.entries()) {
    /**
     * Why can we skip offs? Because of the way that `futureVolumeOverwrites`
     * works, the only volume a cuboid adds is the volume that is never
     * overwritten. Since any portion of an off cuboid that never gets
     * overwritten would not be counted any way, we can skip it.
     */
    if (cuboid.setting === 'off') continue

    const additionalVolume =
      cuboidVolume(cuboid) -
      futureVolumeOverwrites(cuboid, cuboids.slice(idx + 1))

    totalVolume += additionalVolume
  }

  return totalVolume
}

const secondAnswer = partTwo(data) // 1227345351869476

module.exports = {
  createCuboid,
  cuboidVolume,
  partOne,
  partTwo,
}
