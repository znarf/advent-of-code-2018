const fs = require('fs');
const assert = require('assert');

const inputFilename = './day-8.txt';

const input = fs
  .readFileSync(inputFilename, 'utf8')
  .trim()
  .split(' ')
  .map(Number);

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const testInput = [2, 3, 0, 3, 10, 11, 12, 1, 1, 0, 1, 99, 2, 1, 1, 2];

const testTree = [
  {
    index: 0,
    indexAsChar: 'A',
    childCount: 2,
    metadataCount: 3,
    metadata: [1, 1, 2],
    childs: [
      {
        index: 1,
        indexAsChar: 'B',
        childCount: 0,
        metadataCount: 3,
        metadata: [10, 11, 12],
      },
      {
        index: 2,
        indexAsChar: 'C',
        childCount: 1,
        metadataCount: 1,
        metadata: [2],
        childs: [
          {
            index: 3,
            indexAsChar: 'D',
            childCount: 0,
            metadataCount: 1,
            metadata: [99],
          },
        ],
      },
    ],
  },
];

const sum = array => array.reduce((a, b) => a + b, 0);

const getMetadataFromNode = node => {
  let metadata = node.metadata.slice(0);
  if (node.childs) {
    for (const child of node.childs) {
      metadata = [...metadata, ...getMetadataFromNode(child)];
    }
  }
  return metadata;
};

const extractNodesFromStack = (stack, childCount = 1, nodeIndex = 0) => {
  const nodes = [];
  for (let i = 0; i < childCount; i++) {
    const node = {
      index: nodeIndex,
      indexAsChar: alphabet[nodeIndex],
      childCount: stack.shift(),
      metadataCount: stack.shift(),
    };
    nodeIndex++;
    if (node.childCount) {
      node.childs = extractNodesFromStack(stack, node.childCount, nodeIndex);
    }
    if (node.metadataCount) {
      node.metadata = stack.splice(0, node.metadataCount);
    }
    nodes.push(node);
  }
  return nodes;
};

const test = () => {
  const stack = testInput.slice(0);
  const tree = extractNodesFromStack(stack);
  assert.deepStrictEqual(tree, testTree);
  const metadata = getMetadataFromNode(tree[0]);
  assert.strictEqual(sum(metadata), 138);
};

const run = () => {
  const stack = input.slice(0);
  const tree = extractNodesFromStack(stack);
  const metadata = getMetadataFromNode(tree[0]);
  console.log('What is the sum of all metadata entries?', sum(metadata));
};

test();

run();
