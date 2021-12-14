const { partOne, partTwo, optimizedApplyInsertions, parseInput } = require('./')

const data = `
NNCB

BB -> N
BC -> B
BH -> H
BN -> B
CB -> H
CC -> N
CH -> B
CN -> C
HB -> C
HC -> B
HH -> N
HN -> C
NB -> B
NC -> B
NH -> C
NN -> C
`

test('partOne', () => {
  expect(partOne(data)).toEqual(1588)
})

test('partTwo', () => {
  expect(partTwo(data, 40)).toEqual(2188189693529)
})

test('optimizedApplyInsertions', () => {
  const [template, insertions] = parseInput(data)

  expect(optimizedApplyInsertions(template, insertions, 1)).toEqual({
    B: 2,
    C: 2,
    H: 1,
    N: 2,
  })
  expect(optimizedApplyInsertions(template, insertions, 2)).toEqual({
    N: 2,
    B: 6,
    C: 4,
    H: 1,
  })
  expect(optimizedApplyInsertions(template, insertions, 3)).toEqual({
    N: 5,
    B: 11,
    C: 5,
    H: 4,
  })
})
