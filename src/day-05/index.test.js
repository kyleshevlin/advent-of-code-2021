const { generatePointsForLine, layoutLines } = require('./')

test('generatePointsForLine', () => {
  expect(generatePointsForLine({ x1: 0, y1: 0, x2: 0, y2: 5 })).toEqual([
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
  ])

  expect(generatePointsForLine({ x1: 0, y1: 5, x2: 0, y2: 0 })).toEqual([
    [0, 5],
    [0, 4],
    [0, 3],
    [0, 2],
    [0, 1],
    [0, 0],
  ])

  expect(generatePointsForLine({ x1: 0, y1: 0, x2: 5, y2: 0 })).toEqual([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
  ])

  expect(generatePointsForLine({ x1: 5, y1: 0, x2: 0, y2: 0 })).toEqual([
    [5, 0],
    [4, 0],
    [3, 0],
    [2, 0],
    [1, 0],
    [0, 0],
  ])
})

const makeLine = (x1, y1, x2, y2) => ({ x1, y1, x2, y2 })

test('layoutLines', () => {
  const lines = [makeLine(2, 0, 2, 4), makeLine(0, 2, 4, 2)]

  expect(layoutLines(lines)).toEqual([
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 2, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ])
})
