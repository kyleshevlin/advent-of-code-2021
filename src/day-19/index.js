const fs = require('fs')
const path = require('path')
const {
  createQueue,
  getAllUniquePairs,
  intersection,
  noNegZero,
} = require('../utils')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function parseInput(input) {
  return input
    .trim()
    .split('\n\n')
    .map(scanner =>
      scanner
        .split('\n')
        .slice(1)
        .map(beacon => beacon.split(',').map(Number))
    )
}

/**
 * Create a "signature", a unique identifier, between any two points
 * This will create a value that should be the same between identical points
 * even if their scanner orientation is different. These signatures can be used
 * to find overlapping scanners
 */
function createPointsSignature(point1, point2) {
  const [x1, y1, z1] = point1
  const [x2, y2, z2] = point2

  const dx = Math.abs(x1 - x2)
  const dy = Math.abs(y1 - y2)
  const dz = Math.abs(z1 - z2)

  return dx ** 2 + dy ** 2 + dz ** 2
}

const mapNoNegZero = arr => arr.map(noNegZero)

// Borrowed from https://github.com/yangdanny97/advent-of-code/blob/main/src/day19.res
// first one that actually worked once you remove negative 0
const ROTATION_FNS = [
  ([x, y, z]) => mapNoNegZero([x, y, z]),
  ([x, y, z]) => mapNoNegZero([x, z, -y]),
  ([x, y, z]) => mapNoNegZero([x, -y, -z]),
  ([x, y, z]) => mapNoNegZero([x, -z, y]),
  ([x, y, z]) => mapNoNegZero([-x, -y, z]),
  ([x, y, z]) => mapNoNegZero([-x, -z, -y]),
  ([x, y, z]) => mapNoNegZero([-x, y, -z]),
  ([x, y, z]) => mapNoNegZero([-x, z, y]),
  ([x, y, z]) => mapNoNegZero([y, -x, z]),
  ([x, y, z]) => mapNoNegZero([y, z, x]),
  ([x, y, z]) => mapNoNegZero([y, x, -z]),
  ([x, y, z]) => mapNoNegZero([y, -z, -x]),
  ([x, y, z]) => mapNoNegZero([-y, x, z]),
  ([x, y, z]) => mapNoNegZero([-y, z, -x]),
  ([x, y, z]) => mapNoNegZero([-y, -x, -z]),
  ([x, y, z]) => mapNoNegZero([-y, -z, x]),
  ([x, y, z]) => mapNoNegZero([z, y, -x]),
  ([x, y, z]) => mapNoNegZero([z, -x, -y]),
  ([x, y, z]) => mapNoNegZero([z, x, y]),
  ([x, y, z]) => mapNoNegZero([z, -y, x]),
  ([x, y, z]) => mapNoNegZero([-z, -x, y]),
  ([x, y, z]) => mapNoNegZero([-z, y, x]),
  ([x, y, z]) => mapNoNegZero([-z, x, -y]),
  ([x, y, z]) => mapNoNegZero([-z, -y, -x]),
]

function createScanner(beacons) {
  const beaconPairs = getAllUniquePairs(beacons)

  const signatures = new Set()
  const fingerprintA = new Map()
  const fingerprintB = new Map()

  beaconPairs.forEach(pair => {
    const [a, b] = pair
    const signature = createPointsSignature(a, b)

    signatures.add(signature)
    fingerprintA.set(signature, a)
    fingerprintB.set(signature, b)
  })

  return {
    beacons,
    fingerprintA,
    fingerprintB,
    signatures,
  }
}

function getScanners(input) {
  return parseInput(input).map(createScanner)
}

function createScannerQueue(scanners) {
  const queue = createQueue()

  for (const scanner of scanners) {
    queue.enqueue(scanner)
  }

  return queue
}

function getSharedSignatures(scanner1, scanner2) {
  const sharedSignatures = intersection(
    scanner1.signatures,
    scanner2.signatures
  )

  return sharedSignatures
}

function getSharedBeacons(scanner1, scanner2) {
  const sharedSignatures = getSharedSignatures(scanner1, scanner2)
  const beaconsFromScanner1 = new Set()
  const beaconsFromScanner2 = new Set()

  for (const sig of sharedSignatures) {
    beaconsFromScanner1.add(scanner1.fingerprintA.get(sig))
    beaconsFromScanner1.add(scanner1.fingerprintB.get(sig))
    beaconsFromScanner2.add(scanner2.fingerprintA.get(sig))
    beaconsFromScanner2.add(scanner2.fingerprintB.get(sig))
  }

  return { beaconsFromScanner1, beaconsFromScanner2 }
}

const add = (p1, p2) => {
  const [a, b, c] = p1
  const [x, y, z] = p2

  return [a + x, b + y, c + z]
}

const subtract = (p1, p2) => {
  const [a, b, c] = p1
  const [x, y, z] = p2

  return [a - x, b - y, c - z]
}

function locateScannerRelative(scanner1, scanner2) {
  const { beaconsFromScanner1, beaconsFromScanner2 } = getSharedBeacons(
    scanner1,
    scanner2
  )

  const firstBeacons = Array.from(beaconsFromScanner1)
  const secondBeacons = Array.from(beaconsFromScanner2)
  const counts = {}

  for (const firstPoint of firstBeacons) {
    for (const rotationFn of ROTATION_FNS) {
      const rotatedPoints = secondBeacons.map(rotationFn)

      for (const secondPoint of rotatedPoints) {
        const difference = subtract(firstPoint, secondPoint)
        const key = difference.join()

        if (!counts[key]) {
          counts[key] = 0
        }

        counts[key]++

        if (counts[key] >= 12) {
          return [difference, rotationFn]
        }
      }
    }
  }
}

function getBeaconAndScannerLocations(scanners) {
  const queue = createScannerQueue(scanners)
  const primeScanner = queue.dequeue()

  const scannerLocations = [[0, 0, 0]]

  const beaconLocations = new Map()
  for (const beacon of primeScanner.beacons) {
    const key = beacon.join()
    beaconLocations.set(key, beacon)
  }

  let motherScanner = createScanner(beaconLocations.values())

  while (!queue.isEmpty()) {
    const nextScanner = queue.dequeue()

    // See if they overlap
    if (getSharedSignatures(motherScanner, nextScanner).size < 66) {
      queue.enqueue(nextScanner)
      continue
    }

    // This should result in getting the the nextScanner's location
    // and the rotationFn that was applied to achieve it
    const result = locateScannerRelative(motherScanner, nextScanner)

    if (!result) {
      queue.enqueue(nextScanner)
      continue
    }

    const [scannerLocation, rotationFn] = result
    scannerLocations.push(scannerLocation)

    for (const beacon of nextScanner.beacons) {
      const rotatedPoint = rotationFn(beacon)
      const absolutePoint = add(scannerLocation, rotatedPoint)
      const key = absolutePoint.join()
      beaconLocations.set(key, absolutePoint)
    }

    motherScanner = createScanner(beaconLocations.values())
  }

  return { scannerLocations, beaconLocations }
}

function partOne(input) {
  const scanners = getScanners(input)
  const { beaconLocations } = getBeaconAndScannerLocations(scanners)

  return beaconLocations.size
}

const firstAnswer = partOne(data) // 459

function manhattanDistance(point1, point2) {
  const [x1, y1, z1] = point1
  const [x2, y2, z2] = point2

  const dx = Math.abs(x1 - x2)
  const dy = Math.abs(y1 - y2)
  const dz = Math.abs(z1 - z2)

  return dx + dy + dz
}

function partTwo(input) {
  const scanners = getScanners(input)
  const { scannerLocations } = getBeaconAndScannerLocations(scanners)

  const scannerPairs = getAllUniquePairs(scannerLocations)

  const result = Math.max(
    ...scannerPairs.map(pair => manhattanDistance(...pair))
  )

  return result
}

const secondAnswer = partTwo(data) // 19130

module.exports = {
  createScanner,
  getScanners,
  getSharedBeacons,
  locateScannerRelative,
  partOne,
  partTwo,
}
