const { partOne } = require('./')

test('partOne', () => {
  const data = `
2199943210
3987894921
9856789892
8767896789
9899965678
`

  expect(partOne(data)).toEqual(15)
})
