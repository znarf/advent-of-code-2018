const assert = require('assert');

const sum = array => array.reduce((a, b) => a + b, 0);

const getNextIndex = (marbles, index, step = 1, clockWise = true) => {
  for (let i = 0; i < step; i++) {
    if (clockWise) {
      if (!marbles[index + 1]) {
        index = 0;
      } else {
        index++;
      }
    } else {
      if (index === 0) {
        index = marbles.length - 1;
      } else {
        index--;
      }
    }
  }
  return index;
};

const playMarble = (playersCount, marbleMax = 10000) => {
  const scores = {};
  const marbles = [0];
  let marbleNumber = 0;
  let currentMarbleIndex = 0;
  while (marbleNumber < marbleMax) {
    for (let player = 1; player <= playersCount; player++) {
      marbleNumber++;
      if (marbleNumber % 23 === 0) {
        // Special case!
        scores[player] = scores[player] || [];
        scores[player].push(marbleNumber);
        currentMarbleIndex = getNextIndex(marbles, currentMarbleIndex, 7, false);
        const takenMarbles = marbles.splice(currentMarbleIndex, 1);
        scores[player].push(takenMarbles.shift());
      } else {
        // Normal case
        currentMarbleIndex = getNextIndex(marbles, currentMarbleIndex, 1) + 1;
        marbles.splice(currentMarbleIndex, 0, marbleNumber);
      }
      if (marbleNumber >= marbleMax) {
        break;
      }
    }
  }

  return { marbles, marbleNumber, scores };
};

const maxScore = scores => Math.max(...Object.values(scores).map(sum));

const test = () => {
  assert.strictEqual(getNextIndex([0], 0), 0);
  assert.strictEqual(getNextIndex([0, 1], 1), 0);
  assert.strictEqual(getNextIndex([0, 2, 1], 1), 2);
  assert.strictEqual(getNextIndex([0, 2, 1, 3], 3), 0);
  assert.strictEqual(getNextIndex([0, 4, 2, 1, 3], 1), 2);
  assert.strictEqual(getNextIndex([0, 4, 2, 5, 1, 3], 3), 4);
  assert.deepStrictEqual(playMarble(9, 22).marbles, [
    0,
    16,
    8,
    17,
    4,
    18,
    9,
    19,
    2,
    20,
    10,
    21,
    5,
    22,
    11,
    1,
    12,
    6,
    13,
    3,
    14,
    7,
    15
  ]);
  assert.deepStrictEqual(playMarble(9, 23).marbles, [
    0,
    16,
    8,
    17,
    4,
    18,
    19,
    2,
    20,
    10,
    21,
    5,
    22,
    11,
    1,
    12,
    6,
    13,
    3,
    14,
    7,
    15
  ]);
  assert.strictEqual(maxScore(playMarble(9, 25).scores), 32);
  assert.strictEqual(maxScore(playMarble(10, 1618).scores), 8317);
  assert.strictEqual(maxScore(playMarble(13, 7999).scores), 146373);
  assert.strictEqual(maxScore(playMarble(17, 1104).scores), 2764);
  assert.strictEqual(maxScore(playMarble(21, 6111).scores), 54718);
  assert.strictEqual(maxScore(playMarble(30, 5807).scores), 37305);
};

const run = () => {
  const result = playMarble(479, 71035);
  console.log("What is the winning Elf's score?", maxScore(result.scores));
};

test();

run();
