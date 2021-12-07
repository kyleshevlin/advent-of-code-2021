const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const crabPositions = data.trim().split(',').map(Number)

const simpleFuelUsage = (num, position) => Math.abs(num - position)

const complexFuelUsage = (num, position) => {
  let diff = Math.abs(num - position)
  let result = 0

  while (diff) {
    result += diff
    diff--
  }

  return result
}

function main(positions, fuelCalculation = simpleFuelUsage) {
  const min = Math.min(...positions)
  const max = Math.max(...positions)
  const simulations = []

  for (let i = min; i <= max; i++) {
    const fuels = positions.map(num => fuelCalculation(num, i))
    const fuel = fuels.reduce((acc, cur) => acc + cur, 0)
    simulations.push({ fuel, position: i })
  }

  const result = simulations.reduce(
    (acc, cur) => {
      if (cur.fuel < acc.fuel) return cur
      return acc
    },
    {
      fuel: Infinity,
    }
  )

  return result
}

const firstAnswer = main(crabPositions) // 352331
const secondAnswer = main(crabPositions, complexFuelUsage) // 99266250

module.exports = {
  main,
  complexFuelUsage,
}
