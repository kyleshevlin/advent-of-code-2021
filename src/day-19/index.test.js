const {
  getScanners,
  getSharedBeacons,
  locateScannerRelative,
  partOne,
  partTwo,
} = require('./')
const data = require('./testData')

test('partOne', () => {
  expect(partOne(data)).toEqual(79)
})

xtest('partTwo', () => {
  expect(partTwo(data)).toEqual(3621)
})

test('getSharedBeacons', () => {
  const [first, second] = getScanners(data)
  const { beaconsFromScanner1, beaconsFromScanner2 } = getSharedBeacons(
    first,
    second
  )
  const expectedFromFirstScanner = new Set([
    [-618, -824, -621],
    [-537, -823, -458],
    [-447, -329, 318],
    [404, -588, -901],
    [544, -627, -890],
    [528, -643, 409],
    [-661, -816, -575],
    [390, -675, -793],
    [423, -701, 434],
    [-345, -311, 381],
    [459, -707, 401],
    [-485, -357, 347],
  ])

  const expectedFromSecondScanner = new Set([
    [686, 422, 578],
    [605, 423, 415],
    [515, 917, -361],
    [-336, 658, 858],
    [-476, 619, 847],
    [-460, 603, -452],
    [729, 430, 532],
    [-322, 571, 750],
    [-355, 545, -477],
    [413, 935, -424],
    [-391, 539, -444],
    [553, 889, -390],
  ])

  expect(beaconsFromScanner1).toEqual(expectedFromFirstScanner)
  expect(beaconsFromScanner2).toEqual(expectedFromSecondScanner)
})

test('locateScannerRelative', () => {
  const [first, second] = getScanners(data)
  const result = locateScannerRelative(first, second)

  expect(result[0]).toEqual([68, -1246, -43])
})
