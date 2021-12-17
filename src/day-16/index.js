const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

const HEX_TO_BINARY = {
  0: '0000',
  1: '0001',
  2: '0010',
  3: '0011',
  4: '0100',
  5: '0101',
  6: '0110',
  7: '0111',
  8: '1000',
  9: '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111',
}

const convertHexToBinary = input =>
  [...input].map(char => HEX_TO_BINARY[char]).join('')

const toDecimal = str => parseInt(str, 2)

function parsePacket(context, numberOfPackets = Infinity) {
  // const versions = []
  const result = []

  while (context.str.length > 6 && numberOfPackets !== 0) {
    const version = toDecimal(context.str.slice(0, 3))
    // versions.push(version)
    const type = toDecimal(context.str.slice(3, 6))
    context.str = context.str.slice(6)

    if (type === 4) {
      let binaryValue = ''
      let done = false

      while (!done) {
        binaryValue += context.str.substring(1, 5)
        if (context.str[0] === '0') done = true
        context.str = context.str.slice(5)
      }

      result.push(toDecimal(binaryValue))
    } else {
      const children = []
      const typeId = context.str[0]
      context.str = context.str.slice(1)

      if (typeId === '0') {
        const length = toDecimal(context.str.slice(0, 15))
        const subPackets = context.str.slice(15, 15 + length)
        // const subVersions = parsePacket({ str: subPackets })
        // versions.push(...subVersions)
        children.push(...parsePacket({ str: subPackets }))
        context.str = context.str.slice(15 + length)
      }

      if (typeId === '1') {
        const numberOfPackets = toDecimal(context.str.slice(0, 11))
        context.str = context.str.slice(11)
        // TODO: I absolutely _hate_ that this depends on a reference so that
        // it mutates _this_ context in the recursive substack of calls. Ugh.
        // const subVersions = parsePacket(context, numberOfPackets)
        // versions.push(...subVersions)
        children.push(...parsePacket(context, numberOfPackets))
      }

      switch (type) {
        case 0:
          result.push(children.reduce((a, c) => a + c, 0))
          break
        case 1:
          result.push(children.reduce((a, c) => a * c, 1))
          break
        case 2:
          result.push(Math.min(...children))
          break
        case 3:
          result.push(Math.max(...children))
          break
        case 5: {
          const value = children[0] > children[1] ? 1 : 0
          result.push(value)
          break
        }
        case 6: {
          const value = children[0] < children[1] ? 1 : 0
          result.push(value)
          break
        }
        case 7: {
          const value = children[0] === children[1] ? 1 : 0
          result.push(value)
          break
        }
        default:
      }
    }

    numberOfPackets--
  }

  return result
}

function partOne(input) {
  const binary = convertHexToBinary(input)
  const versions = parsePacket({ str: binary })
  const result = versions.reduce((a, c) => a + c, 0)
  return result
}

// The actual answer is in the console.log for this one
// const firstAnswer = partOne(data) // 977
// console.log(firstAnswer)

function partTwo(input) {
  const binary = convertHexToBinary(input)
  const [result] = parsePacket({ str: binary })
  return result
}

const secondAnswer = partTwo(data) // 101501020883
console.log(secondAnswer)

module.exports = {
  partOne,
  partTwo,
}
