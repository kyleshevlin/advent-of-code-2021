const { partOne, partTwo } = require('./')

const data = `target area: x=20..30, y=-10..-5`

test('partOne', () => {
  expect(partOne(data)).toEqual(45)
})

test('partTwo', () => {
  expect(partTwo(data)).toEqual(112)
})
