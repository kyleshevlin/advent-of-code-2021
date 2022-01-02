function intersection(set1, set2) {
  const result = new Set()

  for (const item of set1) {
    if (set2.has(item)) {
      result.add(item)
    }
  }

  return result
}

function union(set1, set2) {
  const result = new Set(set1)

  for (const item of set2) {
    result.add(item)
  }

  return result
}

function zip(...arrays) {
  const lengths = arrays.map(array => array.length)
  const minLength = Math.min(...lengths)
  const result = []

  for (let idx = 0; idx < minLength; idx++) {
    const group = []

    for (const arr of arrays) {
      group.push(arr[idx])
    }

    result.push(group)
  }

  return result
}

function getAllUniquePairs(items) {
  const itemsArray = Array.from(items)
  const pairs = []

  let i
  let j

  for (i = 0; i < itemsArray.length; i++) {
    for (j = i + 1; j < itemsArray.length; j++) {
      pairs.push([itemsArray[i], itemsArray[j]])
    }
  }

  return pairs
}

function createQueue() {
  const queue = []

  return {
    dequeue() {
      return queue.shift()
    },
    enqueue(item) {
      queue.push(item)
    },
    isEmpty() {
      return queue.length === 0
    },
  }
}

const noNegZero = n => (n === -0 ? 0 : n)

const getRangeIndices = ([start, end]) => {
  if (end < start) throw new Error('end needs ot be greater than start')

  // + 1 includes the end of the range
  const diff = Math.abs(end + 1 - start)
  return Array(diff)
    .fill()
    .map((_, idx) => start + idx)
}

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
    isEmpty() {
      return queue.length === 0
    },
    print() {
      console.log(queue)
    },
  }

  return result
}

const sum = (x, y) => x + y

const product = (x, y) => x * y

const PAD_BIAS = {
  front: ['unshift', 'push'],
  back: ['push', 'unshift'],
}

function pad(str, length, char, bias = 'front') {
  if (char.length > 1) {
    throw new Error('`char` argument can only have a length of 1')
  }

  if (str.length >= length) return str

  const chars = [...str]
  const biasMethods = PAD_BIAS[bias] ?? PAD_BIAS.front

  let idx = 0
  while (chars.length < length) {
    const method = biasMethods[idx % 2]
    chars[method](char)
    idx++
  }

  return chars.join('')
}

module.exports = {
  createPriorityQueue,
  createQueue,
  getAllUniquePairs,
  getRangeIndices,
  intersection,
  noNegZero,
  pad,
  product,
  sum,
  union,
  zip,
}
