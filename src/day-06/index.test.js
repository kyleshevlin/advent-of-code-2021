const { simulation, optimizedSimulation } = require('./')

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

const emptyFish = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
}

const mergeFish = (partial = {}) => ({
  ...emptyFish,
  ...partial,
})

test('optimizedSimulation', () => {
  const sim = optimizedSimulation([3])

  expect(sim.getFish()).toEqual(mergeFish({ 3: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 2: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 1: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 0: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 6: 1, 8: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 5: 1, 7: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 4: 1, 6: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 3: 1, 5: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 2: 1, 4: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 1: 1, 3: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 0: 1, 2: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 1: 1, 6: 1, 8: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 0: 1, 5: 1, 7: 1 }))
  expect(sim.tick()).toEqual(mergeFish({ 4: 1, 6: 2, 8: 1 }))
})
