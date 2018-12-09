const assert = require('assert');

const sum = array => array.reduce((a, b) => a + b, 0);

const playMarble = (playersCount, marbleMax) => {
  const scores = {};
  let marbleNumber = 0;
  let current = { value: marbleNumber };
  current.left = current;
  current.right = current;
  while (marbleNumber < marbleMax) {
    for (let player = 1; player <= playersCount; player++) {
      marbleNumber++;
      if (marbleNumber % 23 === 0) {
        // Special case!
        scores[player] = scores[player] || [];
        scores[player].push(marbleNumber);
        const removed = current.left.left.left.left.left.left.left;
        scores[player].push(removed.value);
        current = removed.right;
        current.left = removed.left;
        current.left.right = current;
      } else {
        // Normal case
        const left = current.right;
        const right = current.right.right;
        current = { value: marbleNumber, left, right };
        left.right = current;
        right.left = current;
      }
      if (marbleNumber >= marbleMax) {
        break;
      }
    }
  }

  return { marbleNumber, scores };
};

const maxScore = scores => Math.max(...Object.values(scores).map(sum));

const test = () => {
  assert.strictEqual(maxScore(playMarble(9, 25).scores), 32);
  assert.strictEqual(maxScore(playMarble(10, 1618).scores), 8317);
  assert.strictEqual(maxScore(playMarble(13, 7999).scores), 146373);
  assert.strictEqual(maxScore(playMarble(17, 1104).scores), 2764);
  assert.strictEqual(maxScore(playMarble(21, 6111).scores), 54718);
  assert.strictEqual(maxScore(playMarble(30, 5807).scores), 37305);
};

const run = () => {
  const partOneResult = playMarble(479, 71035);
  console.log("What is the winning Elf's score? (part one)", maxScore(partOneResult.scores));
  const partTwoResult = playMarble(479, 71035 * 100);
  console.log("What is the winning Elf's score? (part two)", maxScore(partTwoResult.scores));
};

test();

run();
