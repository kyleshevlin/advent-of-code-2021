const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const crabPositions = data.trim().split(',').map(Number)

function main(positions) {
  const min = Math.min(...positions)
  const max = Math.max(...positions)
  const simulations = []

  for (let i = min; i <= max; i++) {
    const fuels = positions.map(num => Math.abs(num - i))
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

module.exports = {
  main,
}
