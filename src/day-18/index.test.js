const {
  addition,
  explode,
  findLeft,
  findRight,
  getMagnitude,
  getSum,
  incrementDepthOfTree,
  pairToTree,
  partOne,
  partTwo,
  split,
  treeReducer,
  treeToPairString,
  parseInputIntoTrees,
} = require('./')

const data = `
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
`

test('partOne', () => {
  expect(partOne(data)).toEqual(4140)
})

test('partTwo', () => {
  expect(partTwo(data)).toEqual(3993)
})

test('findLeft', () => {
  expect(findLeft(pairToTree([1, 2], null, 0))).toEqual(null)

  const tree2 = pairToTree([1, [2, 3]], null, 0)
  expect(findLeft(tree2.right)).toHaveProperty('value', 1)

  const tree3 = pairToTree(
    [
      [1, 2],
      [3, 4],
    ],
    null,
    0
  )
  expect(findLeft(tree3.right)).toHaveProperty('value', 2)

  const tree4 = pairToTree([1, [[2, 3], 4]], null, 0)
  expect(findLeft(tree4.right.left)).toHaveProperty('value', 1)
})

test('findRight', () => {
  expect(findRight(pairToTree([1, 2], null, 0))).toEqual(null)

  const tree2 = pairToTree([[1, 2], 3], null, 0)
  expect(findRight(tree2.left)).toHaveProperty('value', 3)

  const tree3 = pairToTree(
    [
      [1, 2],
      [3, 4],
    ],
    null,
    0
  )
  expect(findRight(tree3.left)).toHaveProperty('value', 3)

  const tree4 = pairToTree([[1, [2, 3]], 4], null, 0)
  expect(findRight(tree4.left.right)).toHaveProperty('value', 4)

  const tree5 = pairToTree(
    JSON.parse('[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,3]]'),
    null,
    0
  )
  expect(findRight(tree5.left.right.right.right)).toHaveProperty('value', 1)
})

test('explode', () => {
  const tree = pairToTree(JSON.parse('[[1,2],[3,4]]'), null, 0)
  explode(tree.right)
  expect(treeToPairString(tree)).toEqual('[[1,5],0]')

  const tree2 = pairToTree(JSON.parse('[[1,2],[3,4]]'), null, 0)
  explode(tree2.left)
  expect(treeToPairString(tree2)).toEqual('[0,[5,4]]')

  const tree3 = pairToTree(JSON.parse('[1,[[2,3],4]]'), null, 0)
  explode(tree3.right.left)
  expect(treeToPairString(tree3)).toEqual('[3,[0,7]]')
})

test('split', () => {
  const tree = pairToTree([1, 11], null, 0)
  split(tree.right)
  expect(treeToPairString(tree)).toEqual('[1,[5,6]]')

  const tree2 = pairToTree([13, 15], null, 0)
  split(tree2.left)
  expect(treeToPairString(tree2)).toEqual('[[6,7],15]')
  split(tree2.right)
  expect(treeToPairString(tree2)).toEqual('[[6,7],[7,8]]')
})

test('addition', () => {
  const x = pairToTree([1, 2], null, 0)
  const y = pairToTree([3, 4], null, 0)
  const result = addition(x, y)
  expect(result.left).toBe(x)
  expect(result.left.depth).toEqual(1)
  expect(result.right).toBe(y)
  expect(result.right.depth).toEqual(1)
  expect(result.parent).toEqual(null)
  expect(treeToPairString(result)).toEqual('[[1,2],[3,4]]')

  const x2 = pairToTree(JSON.parse('[[[[4,3],4],4],[7,[[8,4],9]]]'), null, 0)
  const y2 = pairToTree([1, 1], null, 0)
  const result2 = addition(x2, y2)
  expect(treeToPairString(result2)).toEqual('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]')

  const x3 = pairToTree(
    JSON.parse('[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]'),
    null,
    0
  )
  const y3 = pairToTree(
    JSON.parse('[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]'),
    null,
    0
  )
  const result3 = addition(x3, y3)
  expect(treeToPairString(result3)).toEqual(
    '[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]'
  )
})

test('treeReducer', () => {
  const tree = pairToTree(JSON.parse('[[[[[9,8],1],2],3],4]'), null, 0)
  const result = treeReducer(tree)
  expect(treeToPairString(result)).toEqual('[[[[0,9],2],3],4]')
})

test('getSum', () => {
  const data = `
[1,1]
[2,2]
[3,3]
[4,4]
`
  const trees = parseInputIntoTrees(data)
  const sum = getSum(trees)
  expect(treeToPairString(sum)).toEqual('[[[[1,1],[2,2]],[3,3]],[4,4]]')

  const data2 = `
[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
`
  const trees2 = parseInputIntoTrees(data2)
  const sum2 = getSum(trees2)
  expect(treeToPairString(sum2)).toEqual('[[[[3,0],[5,3]],[4,4]],[5,5]]')

  const data3 = `
[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]
`
  const trees3 = parseInputIntoTrees(data3)
  const sum3 = getSum(trees3)
  expect(treeToPairString(sum3)).toEqual('[[[[5,0],[7,4]],[5,5]],[6,6]]')

  const data4 = `
[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]
`
  const trees4 = parseInputIntoTrees(data4)
  const sum4 = getSum(trees4)
  expect(treeToPairString(sum4)).toEqual(
    '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]'
  )
})

test('incrementDepthOfTree', () => {
  const tree = pairToTree([1, 2], null, 0)
  incrementDepthOfTree(tree)
  expect(tree.depth).toEqual(1)

  const tree2 = pairToTree(JSON.parse('[[1, 2],[3, 4]]'), null, 0)
  incrementDepthOfTree(tree2)
  expect(tree2.depth).toEqual(1)
  expect(tree2.left.depth).toEqual(2)
  expect(tree2.left.parent.depth).toEqual(1)
  expect(tree2.right.depth).toEqual(2)
  expect(tree2.right.parent.depth).toEqual(1)

  const tree3 = pairToTree(JSON.parse('[[[1, 2], 3],[4, 5]]'), null, 0)
  incrementDepthOfTree(tree3)
  expect(tree3.depth).toEqual(1)
  expect(tree3.left.depth).toEqual(2)
  expect(tree3.left.parent.depth).toEqual(1)
  expect(tree3.right.depth).toEqual(2)
  expect(tree3.right.parent.depth).toEqual(1)
  expect(tree3.left.left.depth).toEqual(3)
  expect(tree3.left.left.parent.depth).toEqual(2)
})

test('getMagnitude', () => {
  const newTree = str => pairToTree(JSON.parse(str), null, 0)
  expect(getMagnitude(newTree('[9,1]'))).toEqual(29)
  expect(getMagnitude(newTree('[[1,2],[[3,4],5]]'))).toEqual(143)
})
