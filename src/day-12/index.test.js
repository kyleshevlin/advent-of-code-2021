const { partOne, partTwo } = require('./')

test('partOne', () => {
  const data = `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`

  expect(partOne(data)).toEqual(10)
})

// test('partTwo', () => {
//   expect(partTwo(data)).toEqual(195)
// })
