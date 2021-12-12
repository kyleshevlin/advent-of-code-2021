const fs = require('fs')
const path = require('path')

const data = fs.readFileSync(path.resolve(__dirname, './input.txt'), {
  encoding: 'utf-8',
})

function createGraph() {
  const nodes = new Set()
  const edges = new Set()
  const nodeCache = new Map()

  function createNode(key) {
    if (nodeCache.has(key)) return nodeCache.get(key)

    const children = new Set()

    const node = {
      key,
      children,
      addChild(node) {
        children.add(node)
      },
    }

    nodeCache.set(key, node)

    return node
  }

  return {
    nodes,
    edges,
    addNode(key) {
      nodes.add(createNode(key))
    },
    getNode(key) {
      return [...nodes].find(node => node.key === key)
    },
    addEdge(node1Key, node2Key) {
      const node1 = this.getNode(node1Key)
      const node2 = this.getNode(node2Key)

      node1.addChild(node2)
      node2.addChild(node1)

      const [key1, key2] = [node1Key, node2Key].sort()

      edges.add(`${key1}-${key2}`)
    },
  }
}

function inputToGraph(input) {
  const graph = createGraph()
  input
    .trim()
    .split('\n')
    .forEach(line => {
      const [node1Key, node2Key] = line.split('-')
      graph.addNode(node1Key)
      graph.addNode(node2Key)
      graph.addEdge(node1Key, node2Key)
    })

  return graph
}

function getAllPaths(start, destination) {
  const visited = {}
  const allPaths = []
  const addToAllPaths = pathList => allPaths.push(pathList.join(','))
  const pathList = []

  pathList.push(start.key)

  function traverse(node1, node2) {
    if (node1.key === node2.key) {
      addToAllPaths(pathList)
      return
    }

    visited[node1.key] = true

    if (/^[A-Z]+?/.test(node1.key)) {
      visited[node1.key] = false
    }

    for (const child of node1.children) {
      if (!visited[child.key]) {
        pathList.push(child.key)
        traverse(child, node2)
        pathList.splice(pathList.lastIndexOf(child.key))
      }
    }

    visited[node1.key] = false
  }

  traverse(start, destination)

  return allPaths
}

function partOne(input) {
  const graph = inputToGraph(input)
  const paths = getAllPaths(graph.getNode('start'), graph.getNode('end'))
  return paths.length
}

const firstAnswer = partOne(data) // 5874

function alternativeGetAllPaths(graph) {
  const start = graph.getNode('start')
  const end = graph.getNode('end')
  const visited = {}
  for (const node of graph.nodes) {
    visited[node.key] = 0
  }
  const allPaths = []
  const addToAllPaths = pathList => allPaths.push(pathList.join(','))
  const pathList = []

  pathList.push(start.key)

  function traverse(node1, node2) {
    if (node1.key === node2.key) {
      addToAllPaths(pathList)
      return
    }

    visited[node1.key]++

    if (/^[A-Z]+?/.test(node1.key)) {
      visited[node1.key]--
    }

    for (const child of node1.children) {
      // Never go back to start
      if (child.key === 'start') continue

      if (
        visited[child.key] === 0 ||
        (visited[child.key] === 1 &&
          Object.values(visited).every(value => value < 2))
      ) {
        pathList.push(child.key)
        traverse(child, node2)
        pathList.splice(pathList.lastIndexOf(child.key))
      }
    }

    visited[node1.key] = Math.max(0, visited[node1.key] - 1)
  }

  traverse(start, end)

  return allPaths
}

function partTwo(input) {
  const graph = inputToGraph(input)
  const paths = alternativeGetAllPaths(graph)
  return paths.length
}

const secondAnswer = partTwo(data) // 153592

module.exports = {
  partOne,
  partTwo,
}
