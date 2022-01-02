const { partOne, partTwo } = require('./')

const data = `
#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########
`

test('partOne', () => {
  expect(partOne(data)).toEqual(12521)
})

test('partTwo', () => {
  expect(partTwo(data)).toEqual(44169)
})
