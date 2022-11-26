const fs = require('fs')
const path = require('path')
const { zip } = require('../utils')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

// I have stolen this, I just want the solution, I don't care to put more energy and time into this
function parseInput(input) {
  return input.split('\n').map(command => {
    let [op, a, b] = command.split(' ')

    if (/\d+/.test(a)) {
      a = parseInt(a, 10)
    }

    if (/\d+/.test(b)) {
      b = parseInt(b, 10)
    }

    const args = [a, b].filter(v => v !== undefined)

    return { op, args }
  })
}

// @see https://lodash.com/docs/4.17.15#chunk
const chunk = (array, size) => {
  return array.reduce(
    (acc, item, i) => {
      acc.current.push(item)
      // If we have a full chunk OR are at the end
      if (acc.current.length === size || i === array.length - 1) {
        acc.chunks.push(acc.current)
        acc.current = []
      }
      return acc
    },
    { current: [], chunks: [] }
  ).chunks
}

const digits = Array(9)
  .fill()
  .map((_, i) => i + 1)

const isValidDigit = digit => digit >= 1 && digit <= 9

const getVariableCommands = input => {
  // Number of ops between `inp` commands is 18
  const steps = chunk(input, 18)
  const tests = steps.map(step => {
    /**
     *  0. inp w
     *  1. mul x 0
     *  2. add x z
     *  3. mod x 26
     *  4. div z 1   <-- z_truncate
     *  5. add x 10  <-- x_increment
     *  6. eql x w
     *  7. eql x 0
     *  8. mul y 0
     *  9. add y 25
     * 10. mul y x
     * 11. add y 1
     * 12. mul z y
     * 13. mul y 0
     * 14. add y w
     * 15. add y 5   <-- y_increment
     * 16. mul y x
     * 17. add z y
     */
    const z_truncate = step[4].args[1] === 26
    const x_increment = step[5].args[1]
    const y_increment = step[15].args[1]

    return {
      stackOp: z_truncate ? 'pop' : 'push',
      // Pops read x_inc, pushes read y_inc
      value: z_truncate ? x_increment : y_increment,
    }
  })

  return tests
}

const getRestraints = input =>
  getVariableCommands(input).reduce(
    (vars, { stackOp, value }, i) => {
      const { stack, lines } = vars
      if (stackOp === 'push') {
        stack.push({ value, i })
      } else {
        const head = stack.pop()
        // i = head.i + (head.value + value)
        lines.push({
          left: i,
          right: head.i,
          value: head.value + value,
        })
      }

      return vars
    },
    { stack: [], lines: [] }
  ).lines

function partOne(input, method = 'max') {
  const parsed = parseInput(input)
  const restraints = getRestraints(parsed)
  let result = Array(14).fill(0)

  for (let restraint of restraints) {
    // Part one looks for _max_ values
    const right_input = Math[method](
      ...digits.filter(d => isValidDigit(restraint.value + d))
    )
    const left_input = right_input + restraint.value
    result[restraint.left] = left_input
    result[restraint.right] = right_input
  }

  return result.join('')
}

const firstAnswer = partOne(data)
console.log(firstAnswer)

function partTwo(input) {
  return partOne(input, 'min')
}

const secondAnswer = partTwo(data)
console.log(secondAnswer)

module.exports = {
  partOne,
  partTwo,
}
