const fs = require('fs')
const path = require('path')
const { createPriorityQueue, pad } = require('../utils')
const { createMinHeap } = require('./minHeap')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function parseInput(input) {
  return input.trim().split('\n')
}

/**
 * This day gave me a lot of trouble. I worked through half a Djikstra's solution
 * before I gave up. I have instead copy/pasted this solution here, with the full
 * intention of refactoring it until _I fully understand_ it. Simplest way for me
 * to move forward with the challenge while learning something. The gist is here:
 * https://gist.github.com/p-a/02da9ce4a72418715670a513f6360d7c
 */
const TYPES = ['A', 'B', 'C', 'D']
const COSTS = [1, 10, 100, 1000]
const ROOM_AT = [2, 4, 6, 8]
const heap = createMinHeap()

function solution(lines) {
  const queue = [[0, lines.slice(1, -1).map(row => row.split('').slice(1, -1))]]
  const visited = new Map()

  while (queue.length) {
    const [cost, grid] = heap.pop(queue)

    if (
      ROOM_AT.every((x, t) => grid.slice(1).every(row => row[x] === TYPES[t]))
    )
      return cost

    let done = false
    let hallwayItemsCost = 0
    while (!done) {
      const tempCost = grid[0]
        .map((c, x) => [TYPES.indexOf(c), x])
        .filter(([t]) => t >= 0)
        // home is only occupied of correct types?
        .filter(([t]) =>
          grid.every(
            (row, i) =>
              i == 0 || row[ROOM_AT[t]] === TYPES[t] || row[ROOM_AT[t]] === '.'
          )
        )
        // clear path?
        .filter(([t, x]) =>
          grid[0]
            .slice(1 + Math.min(x, ROOM_AT[t]), Math.max(x, ROOM_AT[t]))
            .every(c => c === '.')
        )
        // move them all - okay to mutate the current state
        .map(([t, x]) => {
          const distx = Math.abs(x - ROOM_AT[t])
          const disty = grid.filter(
            (row, i) => i > 0 && row[ROOM_AT[t]] === '.'
          ).length
          grid[0][x] = '.'
          grid[disty][ROOM_AT[t]] = TYPES[t]
          return (distx + disty) * COSTS[t]
        })
        .reduce((sum, c) => sum + c, 0)
      done = tempCost === 0
      hallwayItemsCost += tempCost
    }
    // move out top items to hallway if there are items of wrong type in room
    // add a state for each top item for each reachable position in the hallway
    const top_items = TYPES.map((_, t) => t)
      .map(t => [t, grid.slice(1).map(row => row[ROOM_AT[t]])])
      .filter(([t, room]) => room.some(c => c !== '.' && c !== TYPES[t]))
      .map(([t, room]) => [ROOM_AT[t], room.findIndex(c => c !== '.')])
      .map(([x, depth]) => [TYPES.indexOf(grid[depth + 1][x]), [x, depth + 1]])

    // if no top items, this could be the final state
    const newStates =
      hallwayItemsCost && top_items.length === 0
        ? [[hallwayItemsCost + cost, grid]]
        : []

    // for each top item, if any, move out to reachable hallway positions
    top_items
      .reduce(
        (states, [type, [x, y]]) =>
          grid[0]
            .map((c, x) => [c, x])
            // available slots
            .filter(([c, x]) => !ROOM_AT.includes(x) && c === '.')
            .map(([, x]) => x)
            // clear hallway path ?
            .filter(h_x =>
              grid[0]
                .slice(Math.min(x, h_x), 1 + Math.max(x, h_x))
                .every(c => c === '.')
            )
            .reduce((states, h_x) => {
              const state = grid.map(row => row.map(c => c))
              state[0][h_x] = TYPES[type]
              state[y][x] = '.'
              const new_cost =
                hallwayItemsCost + cost + (Math.abs(h_x - x) + y) * COSTS[type]
              return [...states, [new_cost, state]]
            }, states),
        newStates
      )
      .map(([cost, state]) => [state.join(), cost, state])
      .filter(
        ([key, new_cost]) => !visited.has(key) || new_cost < visited.get(key)
      )
      .forEach(([key, new_cost, state]) => {
        visited.set(key, new_cost)
        heap.push(queue, [new_cost, state])
      })
  }
}

function partOne(input) {
  const lines = parseInput(input)
  const result = solution(lines)

  return result
}

const firstAnswer = partOne(data) // 13556

function partTwo(input) {
  const lines = parseInput(input)
  const allLines = [
    ...lines.slice(0, 3),
    '  #D#C#B#A#  ',
    '  #D#B#A#C#  ',
    ...lines.slice(3),
  ]
  const result = solution(allLines)

  return result
}

const secondAnswer = partTwo(data) // 54200

module.exports = {
  partOne,
  partTwo,
}
