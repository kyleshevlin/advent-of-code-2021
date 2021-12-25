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
  const scores = [0, 0]
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

function partTwo(input) {}

module.exports = {
  partOne,
  partTwo,
}
