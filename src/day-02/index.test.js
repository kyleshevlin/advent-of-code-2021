const { calculateEndpointComplex, calculateEndpointSimple } = require('./')

test('calculateEndpointSimple', () => {
  const directions = [
    ['forward', 4],
    ['down', 3],
    ['forward', 6],
    ['up', 1],
    ['down', 8],
  ]

  expect(calculateEndpointSimple(directions)).toEqual({ x: 10, y: 10 })
})

test('calculateEndpointComplex', () => {
  const directions = [
    ['forward', 5],
    ['down', 5],
    ['forward', 8],
    ['up', 3],
    ['down', 8],
    ['forward', 2],
  ]

  expect(calculateEndpointComplex(directions)).toEqual({ x: 15, y: 60 })
})
