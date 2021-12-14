const { partOne, partTwo } = require('./')

const data = `
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`

test('partOne', () => {
  expect(partOne(data)).toEqual(1588)
})

xtest('partTwo', () => {
  expect(partTwo(data)).toEqual()
})
