const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function createPriorityQueue() {
  const queue = []

  const createQueueElement = (key, priority) => ({ key, priority })

  const result = {
    enqueue(key, priority) {
      const element = createQueueElement(key, priority)
      let added = false

      for (const [idx, item] of queue.entries()) {
        if (element.priority < item.priority) {
          queue.splice(idx, 0, element)
          added = true
          break
        }
      }

      if (!added) queue.push(element)
    },
    dequeue() {
      const item = queue.shift()
      return item?.key
    },
    requeue(key, priority) {
      const index = queue.findIndex(item => item.key === key)
      queue.splice(index, 1)
      result.enqueue(key, priority)
    },
    isEmpty() {
      return queue.length === 0
    },
    print() {
      console.log(queue)
    },
  }

  return result
}

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

      neighbors.forEach(neighbor => {
        graph.addNode(neighbor.key, neighbor.value)
        graph.addEdge(nodeKey, neighbor.key, neighbor.value)
      })
    }
  }

  return graph
}

// TODO: Better, passes test, but doesn't get solve the puzzle
function astar(graph, start, end) {
  // hold the distances from the start node to every other node
  const distances = {}
  // Use this to track the adjacent node by which a node was reached
  const visited = {}
  // Create a queue of nodes to visit
  const nodesToVisitQueue = createPriorityQueue()

  // Initialize nodes
  for (const node of graph.nodes) {
    distances[node.key] = Infinity
    visited[node.key] = false
    nodesToVisitQueue.enqueue(node.key, Infinity)
  }

  // Update for starting node
  distances[start.key] = 0
  nodesToVisitQueue.requeue(start.key, 0)

  // While we have unvisited nodes...
  while (!nodesToVisitQueue.isEmpty()) {
    const currentNodeKey = nodesToVisitQueue.dequeue()
    const currentNode = graph.getNode(currentNodeKey)

    // If we find the end, return the pathNodeKeys
    if (currentNode.key === end.key) {
      return distances[currentNode.key]
    }

    // Mark the node as visited
    visited[currentNode.key] = true

    // Get the neighboring nodes
    const neighborNodes = currentNode.children

    // Update the distance to the neighboring nodes
    for (const neighbor of neighborNodes) {
      if (visited[neighbor.key]) continue

      // Edge from current to neighbor, edge has weight
      const edge = graph.getEdge(currentNode.key, neighbor.key)

      // Get the currently stored distance
      const storedDistance = distances[neighbor.key]

      // Calculate the next potential distance
      // FIXME: My guess is the bug is here
      const nextPotentialDistance = distances[currentNode.key] + edge.weight

      if (nextPotentialDistance < storedDistance) {
        // replace the stored distance
        distances[neighbor.key] = nextPotentialDistance
        // reprioritize the neighbor in the priority queue
        nodesToVisitQueue.requeue(neighbor.key, nextPotentialDistance)
      }
    }
  }

  // We done fucked up
  return 0
}

function partOne(input) {
  const matrix = createMatrix(input)
  const graph = matrixToGraph(matrix)
  const result = astar(
    graph,
    graph.getNode('0-0'),
    graph.getNode(`${matrix.length - 1}-${matrix[0].length - 1}`)
  )

  return result
}

const firstAnswer = partOne(data)
console.log(firstAnswer) // 519, wrong

function partTwo(input) {}

module.exports = {
  partOne,
  partTwo,
}
