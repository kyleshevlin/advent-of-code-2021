const { partOne, partTwo } = require('./')

const data = `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`

test('partOne', () => {
  expect(partOne(data, 10)).toEqual(204)
})

test('partTwo', () => {
  expect(partTwo(data)).toEqual(195)
})
