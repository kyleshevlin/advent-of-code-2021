const { flipBitStr, getBitCountsPerColumn, getWinner } = require('./')

test('flipBitStr', () => {
  expect(flipBitStr('001010110')).toEqual('110101001')
})

test('getBitCountsPerColumn', () => {
  const bits = ['00100', '11110', '10001'].map(str => str.split(''))

  expect(getBitCountsPerColumn(bits)).toEqual({
    0: {
      0: 1,
      1: 2,
    },
    1: {
      0: 2,
      1: 1,
    },
    2: {
      0: 1,
      1: 2,
    },
    3: {
      0: 2,
      1: 1,
    },
    4: {
      0: 2,
      1: 1,
    },
  })
})

test('getWinner', () => {
  expect(getWinner({ 0: 400, 1: 500 })).toEqual('1')
  expect(getWinner({ 0: 500, 1: 400 })).toEqual('0')
})
