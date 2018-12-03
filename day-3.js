const fs = require('fs');
const assert = require('assert');

const inputFilename = './day-3.txt';

const inputFormat = /#(\d+)+\s@\s([0-9,]+):\s([0-9x]+)/;

const entries = fs
  .readFileSync(inputFilename, 'utf8')
  .trim()
  .split('\n');

const testEntries = ['#1 @ 1,3: 4x4', '#2 @ 3,1: 4x4', '#3 @ 5,5: 2x2'];

const parseEntry = entry => {
  const match = inputFormat.exec(entry);
  if (match) {
    const id = Number(match[1]);
    const [left, top] = match[2].split(',').map(Number);
    const [width, height] = match[3].split('x').map(Number);
    return { id, left, top, width, height };
  }
};

const getSquares = entries => {
  const squares = {};
  for (const entry of entries) {
    for (let x = entry.left; x < entry.left + entry.width; x++) {
      for (let y = entry.top; y < entry.top + entry.height; y++) {
        const squareKey = `${x},${y}`;
        squares[squareKey] = (squares[squareKey] || 0) + 1;
      }
    }
  }
  return squares;
};

const countOverlappingSquares = squares => Object.values(squares).filter(count => count > 1).length;

const test = () => {
  const parsedTestEntries = testEntries.map(parseEntry);
  const squares = getSquares(parsedTestEntries);
  assert.equal(countOverlappingSquares(squares), 4);
};

const run = () => {
  const parsedEntries = entries.map(parseEntry);
  const squares = getSquares(parsedEntries);
  console.log(
    'How many square inches of fabric are within two or more claims?',
    countOverlappingSquares(squares),
  );
};

test();

run();
