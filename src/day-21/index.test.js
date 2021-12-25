const { partOne, partTwo } = require('./')

const data = `
4
8
`

test('partOne', () => {
  expect(partOne(data)).toEqual(739785)
})

test('partTwo', () => {
  expect(partTwo(data)).toEqual()
})
