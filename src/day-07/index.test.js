const { main } = require('./')

test('main', () => {
  const data = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14]
  expect(main(data)).toEqual({ position: 2, fuel: 37 })
})
