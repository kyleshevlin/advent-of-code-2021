const { partOne, partTwo } = require('./')

xtest('partOne', () => {
  expect(partOne('8A004A801A8002F478')).toEqual(16)
  expect(partOne('620080001611562C8802118E34')).toEqual(12)
  expect(partOne('C0015000016115A2E0802F182340')).toEqual(23)
  expect(partOne('A0016C880162017C3686B18A3D4780')).toEqual(31)
})

test('partTwo', () => {
  expect(partTwo('C200B40A82')).toEqual(3)
  expect(partTwo('04005AC33890')).toEqual(54)
  expect(partTwo('880086C3E88112')).toEqual(7)
  expect(partTwo('CE00C43D881120')).toEqual(9)
  expect(partTwo('D8005AC2A8F0')).toEqual(1)
  expect(partTwo('F600BC2D8F')).toEqual(0)
  expect(partTwo('9C005AC2F8F0')).toEqual(0)
  expect(partTwo('9C0141080250320F1802104A08')).toEqual(1)
})
