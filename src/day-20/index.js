const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function parseInput(input) {
  const [algorithm, rawImage] = input.split('\n\n').map(str => str.trim())
  const image = rawImage.trim().split('\n')

  return { algorithm, image }
}

function countLightPixels(image) {
  return image
    .join('')
    .split('')
    .filter(p => p === '#').length
}

function getPixelStr(row, col, image, defaultChar) {
  const nw = image[row - 1]?.[col - 1] ?? defaultChar
  const n = image[row - 1]?.[col] ?? defaultChar
  const ne = image[row - 1]?.[col + 1] ?? defaultChar
  const w = image[row]?.[col - 1] ?? defaultChar
  const c = image[row]?.[col] ?? defaultChar
  const e = image[row]?.[col + 1] ?? defaultChar
  const sw = image[row + 1]?.[col - 1] ?? defaultChar
  const s = image[row + 1]?.[col] ?? defaultChar
  const se = image[row + 1]?.[col + 1] ?? defaultChar

  const pixels = [nw, n, ne, w, c, e, sw, s, se]
  const result = pixels.join('')

  return result
}

function getBitStr(pixelStr) {
  return [...pixelStr]
    .map(char => {
      if (char === '.') return 0
      if (char === '#') return 1
    })
    .join('')
}

function enhanceImage(algorithm, image, defaultChar = '.') {
  const result = []

  for (let row = -1; row < image.length + 1; row++) {
    let line = ''

    for (let col = -1; col < image[0].length + 1; col++) {
      const pixelStr = getPixelStr(row, col, image, defaultChar)
      const bitStr = getBitStr(pixelStr)
      const index = parseInt(bitStr, 2)
      const char = algorithm[index]

      line += char
    }

    result.push(line)
  }

  return result
}

function solve(input, steps) {
  const { algorithm, image } = parseInput(input)

  let enhancedImage = image
  for (let i = 0; i < steps; i++) {
    // This edge case is honestly bullshit
    let defaultChar = '.'

    if (algorithm[0] === '#') {
      defaultChar = i % 2 ? '#' : '.'
    }

    enhancedImage = enhanceImage(algorithm, enhancedImage, defaultChar)
  }

  const lightPixelCount = countLightPixels(enhancedImage)

  return lightPixelCount
}

function partOne(input) {
  return solve(input, 2)
}

const firstAnswer = partOne(data) // 5316

function partTwo(input) {
  return solve(input, 50)
}

const secondAnswer = partTwo(data) // 16728

module.exports = {
  enhanceImage,
  parseInput,
  partOne,
  partTwo,
}
