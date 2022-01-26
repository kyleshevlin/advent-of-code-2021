const { createSim, partOne, partTwo } = require('./')

const data = `
v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>
`

describe('simulations', () => {
  it('should move eastwardly', () => {
    const sim = createSim('...>>>>>...')
    expect(sim.tick().print()).toEqual('...>>>>.>..')
    expect(sim.tick().print()).toEqual('...>>>.>.>.')
  })

  it('should move eastward, than southward', () => {
    const sim = createSim(`
..........
.>v....v..
.......>..
..........
`)
    expect(sim.tick().print()).toEqual(
      `
..........
.>........
..v....v>.
..........
`.trim()
    )
  })

  it('should wrap around', () => {
    const sim = createSim(`
...>...
.......
......>
v.....>
......>
.......
..vvv..
`)

    expect(sim.tick().print()).toEqual(
      `
..vv>..
.......
>......
v.....>
>......
.......
....v..
`.trim()
    )
  })
})

test('partOne', () => {
  expect(partOne(data)).toEqual(58)
})

test('partTwo', () => {
  expect(partTwo(data)).toEqual()
})
