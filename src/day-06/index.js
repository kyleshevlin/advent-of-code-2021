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

module.exports = {
  simulation,
}
