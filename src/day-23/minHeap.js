// Stolen from https://gist.github.com/p-a/02da9ce4a72418715670a513f6360d7c
const createMinHeap = () => ({
  siftDown(h, i = 0, v = h[i]) {
    if (i < h.length) {
      let k = v[0]
      while (1) {
        let j = i * 2 + 1
        if (j + 1 < h.length && h[j][0] > h[j + 1][0]) j++
        if (j >= h.length || k <= h[j][0]) break
        h[i] = h[j]
        i = j
      }
      h[i] = v
    }
  },
  heapify(h) {
    for (let i = h.length >> 1; i--; ) this.siftDown(h, i)
    return h
  },
  pop(h) {
    return this.exchange(h, h.pop())
  },
  exchange(h, v) {
    if (!h.length) return v
    let w = h[0]
    this.siftDown(h, 0, v)
    return w
  },
  push(h, v) {
    let k = v[0],
      i = h.length,
      j
    while ((j = (i - 1) >> 1) >= 0 && k < h[j][0]) {
      h[i] = h[j]
      i = j
    }
    h[i] = v
    return h
  },
})

module.exports = {
  createMinHeap,
}
