const { convertToSlidingWindows, increasingValuesCount } = require('./')

test('increasingValuesCount', () => {
  const numbers = [1, 2, 3, 1, 2, 3, 1, 2, 3]
  expect(increasingValuesCount(numbers)).toEqual(6)
})

test('convertToSlidingWindows', () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  expect(convertToSlidingWindows(numbers)).toEqual([6, 9, 12, 15, 18, 21, 24])
})
