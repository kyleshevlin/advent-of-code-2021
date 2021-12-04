const {
  flipBitStr,
  getBitCountsPerColumn,
  getCO2CountIndex,
  getOxygenCountIndex,
  getRating,
  getWinner,
} = require('./')

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

test('getOxygenCountIndex', () => {
  expect(getOxygenCountIndex({ 0: 400, 1: 500 })).toEqual('1')
  expect(getOxygenCountIndex({ 0: 500, 1: 400 })).toEqual('0')
  expect(getOxygenCountIndex({ 0: 400, 1: 400 })).toEqual('1')
})

test('getCO2CountIndex', () => {
  expect(getCO2CountIndex({ 0: 400, 1: 500 })).toEqual('0')
  expect(getCO2CountIndex({ 0: 500, 1: 400 })).toEqual('1')
  expect(getCO2CountIndex({ 0: 400, 1: 400 })).toEqual('0')
})

test('getRating', () => {
  const bits = [
    '00100',
    '11110',
    '10110',
    '10111',
    '10101',
    '01111',
    '00111',
    '11100',
    '10000',
    '11001',
    '00010',
    '01010',
  ].map(str => str.split(''))

  expect(getRating(bits, getOxygenCountIndex).join('')).toEqual('10111')
  expect(getRating(bits, getCO2CountIndex).join('')).toEqual('01010')
})
