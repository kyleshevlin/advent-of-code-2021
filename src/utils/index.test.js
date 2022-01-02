const {
  createQueue,
  getAllUniquePairs,
  getRangeIndices,
  intersection,
  pad,
  union,
  zip,
} = require('./')

test('createQueue', () => {
  const queue = createQueue()
  queue.enqueue(1)
  queue.enqueue(2)
  queue.enqueue(3)

  expect(queue.isEmpty()).toEqual(false)
  expect(queue.dequeue()).toEqual(1)
  expect(queue.dequeue()).toEqual(2)
  expect(queue.dequeue()).toEqual(3)
  expect(queue.isEmpty()).toEqual(true)
})

test('intersection', () => {
  const set1 = new Set([1, 2, 3])
  const set2 = new Set([2, 3, 4])
  const result = intersection(set1, set2)

  expect(result).toEqual(new Set([2, 3]))
})

test('union', () => {
  const set1 = new Set([1, 2, 3])
  const set2 = new Set([2, 3, 4])
  const result = union(set1, set2)

  expect(result).toEqual(new Set([1, 2, 3, 4]))
})

test('zip', () => {
  const arr1 = ['a', 'b', 'c']
  const arr2 = [1, 2, 3]
  const arr3 = [true, false, null]

  expect(zip(arr1, arr2, arr3)).toEqual([
    ['a', 1, true],
    ['b', 2, false],
    ['c', 3, null],
  ])
})

test('getAllUniquePairs', () => {
  const items = [1, 2, 3, 4]

  expect(getAllUniquePairs(items)).toEqual([
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
  ])
})

test('getRangeIndices', () => {
  expect(getRangeIndices([1, 1])).toEqual([1])
  expect(getRangeIndices([0, 5])).toEqual([0, 1, 2, 3, 4, 5])
  expect(getRangeIndices([-2, 2])).toEqual([-2, -1, 0, 1, 2])
})

test('pad', () => {
  expect(pad('foobarbaz', 5, 'a')).toEqual('foobarbaz')
  expect(pad('foo', 10, 'a')).toEqual('aaaafooaaa')
  expect(pad('foo', 10, 'a', 'back')).toEqual('aaafooaaaa')
})
