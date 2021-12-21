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

function zip(arrays) {
  const lengths = arrays.map(array => array.length)
  const maxLength = Math.max(...lengths)
  const result = []

  for (let idx = 0; idx < maxLength; idx++) {
    const group = []

    for (const arr of arrays) {
      group.push(arr[idx])
    }

    result.push(group)
  }

  return result
}

function getAllUniquePairs(items) {
  const pairs = []

  let i
  let j

  for (i = 0; i < items.length; i++) {
    for (j = i + 1; j < items.length; j++) {
      pairs.push([items[i], items[j]])
    }
  }

  return pairs
}

module.exports = {
  getAllUniquePairs,
  intersection,
  union,
  zip,
}
