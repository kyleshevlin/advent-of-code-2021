const { partOne, partTwo } = require('./')

const data = `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`

test('partOne', () => {
  expect(partOne(data)).toEqual(10)
})

test('partTwo', () => {
  expect(partTwo(data)).toEqual(36)
})
