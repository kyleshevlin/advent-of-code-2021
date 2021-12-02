const { calculateEndpoint } = require('./')

test('calculateEndpoint', () => {
  const directions = [
    ['forward', 4],
    ['down', 3],
    ['forward', 6],
    ['up', 1],
    ['down', 8],
  ]
  expect(calculateEndpoint(directions)).toEqual({ x: 10, y: 10 })
})
