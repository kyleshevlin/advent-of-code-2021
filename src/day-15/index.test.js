const { partOne, partTwo } = require('./')

const data = `
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`

test('partOne', () => {
  expect(partOne(data)).toEqual(40)
})

xtest('partTwo', () => {
  expect(partTwo(data)).toEqual()
})
