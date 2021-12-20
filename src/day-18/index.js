const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function parseInputIntoTrees(input) {
  return input
    .trim()
    .split('\n')
    .map(JSON.parse)
    .map(pair => pairToTree(pair, null, 0))
}

function makePairNode(parent, depth) {
  return {
    depth,
    left: null,
    right: null,
    parent,
    type: 'pair',
  }
}

function makeValueNode(value, parent) {
  return {
    parent,
    value,
    type: 'value',
  }
}

function pairToTree(pair, parent, depth) {
  const [left, right] = pair
  const node = makePairNode(parent, depth)

  node.left = Array.isArray(left)
    ? pairToTree(left, node, depth + 1)
    : makeValueNode(left, node)
  node.right = Array.isArray(right)
    ? pairToTree(right, node, depth + 1)
    : makeValueNode(right, node)

  return node
}

function treeToPairString(tree) {
  if (tree.type === 'value') return `${tree.value}`
  return `[${treeToPairString(tree.left)},${treeToPairString(tree.right)}]`
}

function treeReducer(tree) {
  let dirty = false

  do {
    dirty = false
    let operation = () => {}

    traverseTree(tree, node => {
      // only operate once per `do` cycle
      if (dirty) return

      if (node.depth >= 4) {
        operation = () => {
          explode(node)
        }
        dirty = true
        return
      }
    })

    traverseTree(tree, node => {
      if (dirty) return

      if (node.value >= 10) {
        operation = () => {
          split(node)
        }
        dirty = true
        return
      }
    })

    operation()
  } while (dirty)

  return tree
}

function traverseTree(node, visitFn) {
  if (node !== null && node !== undefined) {
    traverseTree(node.left, visitFn)
    visitFn(node)
    traverseTree(node.right, visitFn)
  }
}

function explode(node) {
  const parent = node.parent
  const nearestLeft = findLeft(node)
  const nearestRight = findRight(node)

  if (nearestLeft) {
    nearestLeft.value += node.left.value
  }

  if (nearestRight) {
    nearestRight.value += node.right.value
  }

  const newValueNode = makeValueNode(0, parent)

  if (parent.left === node) {
    parent.left = newValueNode
  }

  if (parent.right === node) {
    parent.right = newValueNode
  }
}

function findLeft(pair) {
  let parent = pair.parent
  let child = pair

  while (parent !== null) {
    if (parent.left !== child) {
      let node = parent.left

      while (node.type !== 'value') {
        node = node.right
      }

      if (node.type === 'value') return node
      return null
    }

    child = parent
    parent = parent.parent
  }

  return null
}

function findRight(pair) {
  let parent = pair.parent
  let child = pair

  while (parent !== null) {
    if (parent.right !== child) {
      let node = parent.right

      while (node.type !== 'value') {
        node = node.left
      }

      if (node.type === 'value') return node
      return null
    }

    child = parent
    parent = parent.parent
  }

  return null
}

/**
 * This node is a value node and the node.value is >= 10
 * Convert this node to a pair node
 */
function split(node) {
  const parent = node.parent

  const newPair = makePairNode(parent, parent.depth + 1)
  newPair.left = makeValueNode(Math.floor(node.value / 2), newPair)
  newPair.right = makeValueNode(Math.ceil(node.value / 2), newPair)

  if (parent.left === node) {
    parent.left = newPair
  }

  if (parent.right === node) {
    parent.right = newPair
  }
}

function incrementDepthOfTree(tree) {
  traverseTree(tree, node => {
    if (node.depth !== undefined) {
      node.depth++
    }
  })
}

function addition(x, y) {
  const newRoot = makePairNode(null, 0)

  incrementDepthOfTree(x)
  incrementDepthOfTree(y)

  x.parent = newRoot
  y.parent = newRoot
  newRoot.left = x
  newRoot.right = y

  const result = treeReducer(newRoot)

  return result
}

function getSum(trees) {
  return trees.reduce((x, y) => {
    const result = addition(x, y)
    return result
  })
}

function getMagnitude(tree) {
  if (tree.type === 'value') return tree.value
  return 3 * getMagnitude(tree.left) + 2 * getMagnitude(tree.right)
}

function partOne(input) {
  const trees = parseInputIntoTrees(input)
  const sum = getSum(trees)
  const result = getMagnitude(sum)

  return result
}

const firstAnswer = partOne(data) // 4207

function copyTree(tree) {
  const pairString = treeToPairString(tree)
  return pairToTree(JSON.parse(pairString), null, 0)
}

function partTwo(input) {
  const trees = parseInputIntoTrees(input)
  const magnitudes = []

  for (const first of trees) {
    for (const second of trees) {
      if (first === second) continue

      const firstCopy = copyTree(first)
      const secondCopy = copyTree(second)

      const result = getMagnitude(addition(firstCopy, secondCopy))
      magnitudes.push(result)
    }
  }

  return Math.max(...magnitudes)
}

const secondAnswer = partTwo(data) // 4635

module.exports = {
  addition,
  explode,
  findLeft,
  findRight,
  getMagnitude,
  getSum,
  incrementDepthOfTree,
  pairToTree,
  parseInputIntoTrees,
  partOne,
  partTwo,
  split,
  treeReducer,
  treeToPairString,
}
