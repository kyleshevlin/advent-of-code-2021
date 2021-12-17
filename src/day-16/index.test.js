const { partOne, partTwo } = require('./')

test('partOne', () => {
  expect(partOne('8A004A801A8002F478')).toEqual(16)
  expect(partOne('620080001611562C8802118E34')).toEqual(12)
  expect(partOne('C0015000016115A2E0802F182340')).toEqual(23)
  expect(partOne('A0016C880162017C3686B18A3D4780')).toEqual(31)
})

xtest('partTwo', () => {
  expect(partTwo(data)).toEqual()
})
