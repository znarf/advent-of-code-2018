const fs = require('fs');
const assert = require('assert');

const inputFilename = './day-3.txt';

const inputFormat = /#(\d+)+\s@\s([0-9,]+):\s([0-9x]+)/;

const entries = fs
  .readFileSync(inputFilename, 'utf8')
  .trim()
  .split('\n');

const testEntries = ['#1 @ 1,3: 4x4', '#2 @ 3,1: 4x4', '#3 @ 5,5: 2x2'];

const arrayFlatten = array => [].concat(...array);

const arrayUnique = array => [...new Set(array)];

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
        squares[squareKey] = squares[squareKey] || [];
        squares[squareKey].push(entry.id);
      }
    }
  }
  return squares;
};

const getOverlappingSquares = squares => {
  return Object.values(squares).filter(ids => ids.length > 1);
};

const getOverlappingIds = squares => {
  return arrayUnique(arrayFlatten(getOverlappingSquares(squares)));
};

const getNonOverlappingId = (entries, squares) => {
  const overlappingIds = getOverlappingIds(squares || getSquares(entries));
  return entries.map(entry => entry.id).find(id => !overlappingIds.includes(id));
};

const test = () => {
  const parsedTestEntries = testEntries.map(parseEntry);
  const testSquares = getSquares(parsedTestEntries);
  assert.equal(getOverlappingSquares(testSquares).length, 4);
  assert.equal(getNonOverlappingId(parsedTestEntries, testSquares), 3);
};

const run = () => {
  const parsedEntries = entries.map(parseEntry);
  const squares = getSquares(parsedEntries);
  console.log(
    'How many square inches of fabric are within two or more claims?',
    getOverlappingSquares(squares).length,
  );
  console.log(
    "What is the ID of the only claim that doesn't overlap?",
    getNonOverlappingId(parsedEntries, squares),
  );
};

test();

run();
