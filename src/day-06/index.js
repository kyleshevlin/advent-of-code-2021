const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const fishData = data.split(',').map(Number)

function simulation(startingFish) {
  let fish = startingFish

  function tick() {
    fish = fish.flatMap(f => {
      const next = f - 1

      if (next === -1) {
        return [6, 8]
      }

      return next
    })

    return fish
  }

  const getFish = () => fish

  return {
    getFish,
    tick,
  }
}

const firstSim = simulation(fishData)

for (let i = 0; i < 80; i++) {
  firstSim.tick()
}

const firstAnswer = firstSim.getFish().length // 372300

function optimizedSimulation(startingFish) {
  const fishCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 }
  startingFish.forEach(f => {
    fishCounts[f]++
  })

  const getFish = () => fishCounts

  function tick() {
    let tmpZeroCount = fishCounts[0]

    for (let i = 1; i < 9; i++) {
      fishCounts[i - 1] = fishCounts[i]
    }

    fishCounts[8] = tmpZeroCount
    fishCounts[6] += tmpZeroCount

    return fishCounts
  }

  return {
    getFish,
    tick,
  }
}

const secondSim = optimizedSimulation(fishData)

for (let i = 0; i < 256; i++) {
  secondSim.tick()
}

const secondAnswer = Object.values(secondSim.getFish()).reduce(
  (acc, cur) => acc + cur,
  0
) // 1675781200288

module.exports = {
  simulation,
  optimizedSimulation,
}
