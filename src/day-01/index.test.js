const increasingValuesCount = require('./')

test('increasingValuesCount', () => {
  const numbers = [1, 2, 3, 1, 2, 3, 1, 2, 3]
  expect(increasingValuesCount(numbers)).toEqual(6)
})
