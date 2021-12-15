const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function createGraph() {
  const nodes = new Set()
  const edges = new Set()
  const nodeCache = new Map()

  function createNode(key, value) {
    if (nodeCache.has(key)) return nodeCache.get(key)

    const children = new Set()

    const node = {
      key,
      children,
      addChild(node) {
        children.add(node)
      },
      value,
    }

    nodeCache.set(key, node)

    return node
  }

  return {
    nodes,
    edges,
    addNode(key, value) {
      const node = createNode(key, value)
      nodes.add(node)
      return node
    },
    getNode(key) {
      return [...nodes].find(node => node.key === key)
    },
    addEdge(key1, key2, weight) {
      const node1 = this.getNode(key1)
      const node2 = this.getNode(key2)

      node1.addChild(node2)
      node2.addChild(node1)

      const key = [key1, key2].sort().join('-')

      edges.add({ key, weight })
    },
    getEdge(key1, key2) {
      const key = [key1, key2].sort().join('-')
      return [...edges].find(edge => edge.key === key)
    },
  }
}

function createMatrix(input) {
  return input
    .trim()
    .split('\n')
    .map(line => line.split('').map(Number))
}

function matrixToGraph(matrix) {
  const graph = createGraph()

  function getCell(rowIdx, colIdx) {
    if (
      rowIdx >= 0 &&
      rowIdx < matrix.length &&
      colIdx >= 0 &&
      colIdx < matrix[0].length
    ) {
      return matrix[rowIdx][colIdx]
    }
  }

  for (const [rowIdx, row] of matrix.entries()) {
    for (const [colIdx, nodeValue] of row.entries()) {
      const nodeKey = `${rowIdx}-${colIdx}`
      graph.addNode(nodeKey, nodeValue)

      const neighbors = [
        { key: `${rowIdx - 1}-${colIdx}`, value: getCell(rowIdx - 1, colIdx) },
        { key: `${rowIdx}-${colIdx + 1}`, value: getCell(rowIdx, colIdx + 1) },
        { key: `${rowIdx + 1}-${colIdx}`, value: getCell(rowIdx + 1, colIdx) },
        { key: `${rowIdx}-${colIdx - 1}`, value: getCell(rowIdx, colIdx - 1) },
      ].filter(({ value }) => Boolean(value))

      neighbors.forEach(({ key, value }) => {
        graph.addNode(key, value)
        graph.addEdge(nodeKey, key, value)
      })
    }
  }

  return graph
}

function getPathNodeKeys(obj, key) {
  const nodeKeys = []
  let currentKey = key

  while (currentKey) {
    nodeKeys.unshift(currentKey)
    currentKey = obj[currentKey]
  }

  return nodeKeys
}

function astar(graph, start, end) {
  // hold the distances from the start node to every other node
  const distances = {}
  // Use this to track the adjacent node that a node was reached
  const via = {}
  // Used to track which nodes we have visited
  const visited = {}

  // Initialize nodes
  for (const node of graph.nodes) {
    distances[node.key] = Infinity
    via[node.key] = start.key
    visited[node.key] = false
  }

  // Update for starting node
  distances[start.key] = 0
  via[start.key] = null

  // While we have unvisited nodes...
  while (Object.values(visited).some(x => !x)) {
    // Get the remaining unvisitedNodes
    const unvisitedNodes = Object.entries(visited)
      .filter(([, value]) => !value)
      .map(([key]) => graph.getNode(key))

    // Select the closest unvisited node as the currentNode
    const { closest: currentNode } = unvisitedNodes.reduce(
      (acc, cur) => {
        const distance = distances[cur.key]

        if (distance < acc.distance) {
          return { distance, closest: cur }
        }

        return acc
      },
      { distance: Infinity, closest: null }
    )

    // If we find the end, return the pathNodeKeys
    if (currentNode.key === end.key) {
      return getPathNodeKeys(via, currentNode.key)
    }

    // Get the neighboring nodes
    const neighborNodes = [...currentNode.children].filter(node => {
      return !visited[node.key]
    })

    // Update the distance to the neighboring nodes
    for (const neighbor of neighborNodes) {
      const edge = graph.getEdge(currentNode.key, neighbor.key)
      const currentDistanceToNeighbor = distances[neighbor.key]
      const nextPotentialDistance = distances[currentNode.key] + edge.weight

      if (nextPotentialDistance < currentDistanceToNeighbor) {
        distances[neighbor.key] = nextPotentialDistance
        via[neighbor.key] = currentNode.key
      }
    }

    // Mark the node as visited
    visited[currentNode.key] = true
  }

  return []
}

function partOne(input) {
  const matrix = createMatrix(input)
  const graph = matrixToGraph(matrix)
  const [, ...pathNodeKeys] = astar(
    graph,
    graph.getNode('0-0'),
    graph.getNode(`${matrix.length - 1}-${matrix[0].length - 1}`)
  )
  const values = pathNodeKeys.map(key => graph.getNode(key).value)
  const result = values.reduce((a, c) => a + c)

  return result
}

// const firstAnswer = partOne(data)
// console.log(firstAnswer)

function partTwo(input) {}

module.exports = {
  partOne,
  partTwo,
}
