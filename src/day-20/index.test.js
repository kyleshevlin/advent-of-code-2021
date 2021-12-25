const {
  enhanceImage,
  matrixToRawImage,
  parseInput,
  partOne,
  partTwo,
} = require('./')

const data = `
..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
`

test('partOne', () => {
  expect(partOne(data)).toEqual(35)
})

test('partTwo', () => {
  expect(partTwo(data)).toEqual(3351)
})

test('enhanceImage', () => {
  const { algorithm, image } = parseInput(data)
  const result = enhanceImage(algorithm, image)

  expect(result).toEqual([
    '.##.##.',
    '#..#.#.',
    '##.#..#',
    '####..#',
    '.#..##.',
    '..##..#',
    '...#.#.',
  ])

  const edgeCaseAlgo = '#' + '.'.repeat(511)
  const result2 = enhanceImage(edgeCaseAlgo, ['...', '...', '...'])
  expect(result2).toEqual(['#####', '#####', '#####', '#####', '#####'])

  const result3 = enhanceImage(edgeCaseAlgo, result2)
  expect(result3).toEqual([
    '.......',
    '.......',
    '.......',
    '.......',
    '.......',
    '.......',
    '.......',
  ])
})
