const { complexFuelUsage, main } = require('./')

test('main', () => {
  const data = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14]
  expect(main(data)).toEqual({ position: 2, fuel: 37 })
})

test('complexFuelUsage', () => {
  expect(complexFuelUsage(1, 3)).toEqual(3)
  expect(complexFuelUsage(5, 10)).toEqual(15)
})

test('main - part 2', () => {
  const data = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14]
  expect(main(data, complexFuelUsage)).toEqual({ position: 5, fuel: 168 })
})
