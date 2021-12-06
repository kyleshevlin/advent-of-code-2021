const { simulation } = require('./')

test('simulation', () => {
  const sim = simulation([3])

  expect(sim.tick()).toEqual([2])
  expect(sim.tick()).toEqual([1])
  expect(sim.tick()).toEqual([0])
  expect(sim.tick()).toEqual([6, 8])
  expect(sim.tick()).toEqual([5, 7])
  expect(sim.tick()).toEqual([4, 6])
  expect(sim.tick()).toEqual([3, 5])
  expect(sim.tick()).toEqual([2, 4])
  expect(sim.tick()).toEqual([1, 3])
  expect(sim.tick()).toEqual([0, 2])
  expect(sim.tick()).toEqual([6, 8, 1])
  expect(sim.tick()).toEqual([5, 7, 0])
  expect(sim.tick()).toEqual([4, 6, 6, 8])
})
