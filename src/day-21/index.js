const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function parseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(line => line[line.length - 1])
    .map(Number)
}

function moveOnBoard(start, spaces) {
  let position = start

  for (let i = 0; i < spaces; i++) {
    position++
    if (position === 11) position = 1
  }

  return position
}

function createGame(player1Position, player2Position, die) {
  const state = {
    status: 'inProgress',
    winner: null,
    turn: 'player1',
    player1: {
      position: player1Position,
      score: 0,
    },
    player2: {
      position: player2Position,
      score: 0,
    },
    diceRolls: 0,
  }

  function takeTurn() {
    const turn = state.turn
    const player = state[turn]

    let rollTotal = 0
    for (let i = 0; i < 3; i++) {
      const result = die.roll()
      rollTotal += result
      state.diceRolls++
    }

    const nextPosition = moveOnBoard(player.position, rollTotal)
    player.position = nextPosition
    player.score += nextPosition

    if (player.score >= 1000) {
      state.status = 'complete'
      state.winner = turn
      return
    }

    state.turn = turn === 'player1' ? 'player2' : 'player1'
  }

  return [state, takeTurn]
}

function createDeterministicDie() {
  let state = 100

  function roll() {
    state = (state % 100) + 1
    return state
  }

  return {
    roll,
  }
}

function runGame(game) {
  const [gameState, takeTurn] = game

  while (gameState.status === 'inProgress') {
    takeTurn()
  }

  return gameState
}

function partOne(input) {
  const [player1Start, player2Start] = parseInput(input)
  const die = createDeterministicDie()
  const game = createGame(player1Start, player2Start, die)

  const finalState = runGame(game)
  const winner = finalState.winner
  const loser = winner === 'player1' ? 'player2' : 'player1'
  const loserScore = finalState[loser].score
  const rolls = finalState.diceRolls

  return loserScore * rolls
}

const firstAnswer = partOne(data) // 518418

const roll = [1, 2, 3]
const frequencies = {}
for (const r1 of roll) {
  for (const r2 of roll) {
    for (const r3 of roll) {
      const key = r1 + r2 + r3
      if (!frequencies[key]) frequencies[key] = 0
      frequencies[key]++
    }
  }
}

function partTwo(input) {
  const [player1Start, player2Start] = parseInput(input)

  // We're going to memoize the outcomes for rolls and positions
  const memo = {}

  function runGame(p1Score, p2Score, p1Position, p2Position, turn) {
    const key = [p1Score, p2Score, p1Position, p2Position, turn].join()
    if (memo[key]) return memo[key]

    // Base cases for the recursion
    if (p1Score >= 21) {
      const result = [1, 0]
      memo[key] = result
      return result
    }

    if (p2Score >= 21) {
      const result = [0, 1]
      memo[key] = result
      return result
    }

    let totalWins = [0, 0]

    for (const [rollTotal, frequency] of Object.entries(frequencies)) {
      let win

      if (turn === 'p1') {
        const nextPos = moveOnBoard(p1Position, rollTotal)
        win = runGame(p1Score + nextPos, p2Score, nextPos, p2Position, 'p2')
      } else {
        const nextPos = moveOnBoard(p2Position, rollTotal)
        win = runGame(p1Score, p2Score + nextPos, p1Position, nextPos, 'p1')
      }

      const [p1TotalWins, p2TotalWins] = totalWins
      const [p1Wins, p2Wins] = win

      totalWins = [
        p1TotalWins + frequency * p1Wins,
        p2TotalWins + frequency * p2Wins,
      ]
    }

    memo[key] = totalWins
    return totalWins
  }

  const [p1Wins, p2Wins] = runGame(0, 0, player1Start, player2Start, 'p1')
  return Math.max(p1Wins, p2Wins)
}

const secondAnswer = partTwo(data) // 116741133558209

module.exports = {
  partOne,
  partTwo,
}
