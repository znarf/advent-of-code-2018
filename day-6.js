const fs = require('fs');
const assert = require('assert');

const inputFilename = './day-6.txt';

const input = fs
  .readFileSync(inputFilename, 'utf8')
  .trim()
  .split('\n')
  .map(e =>
    e
      .split(',')
      .map(p => p.trim())
      .map(Number),
  );

const testInput = [[1, 1], [1, 6], [8, 3], [3, 4], [5, 5], [8, 9]];

const arrayUnique = array => [...new Set(array)];

const parseCoordinates = input => input.map(([x, y], index) => ({ x, y, index }));

const getLargestNonInfiniteArea = input => {
  const coordinates = parseCoordinates(input);

  const xMax = Math.max(...coordinates.map(c => c.x));
  const yMax = Math.max(...coordinates.map(c => c.y));

  const points = [];
  for (let x = 0; x <= xMax; x++) {
    for (let y = 0; y <= yMax; y++) {
      const distances = coordinates.map(c => Math.abs(x - c.x) + Math.abs(y - c.y));
      const minDistance = Math.min(...distances);
      const multiple = distances.filter(d => d === minDistance).length > 1;
      if (!multiple) {
        const closestCoordinateIndex = distances.indexOf(minDistance);
        points.push({ x, y, closestCoordinateIndex, minDistance });
      }
    }
  }

  const infiniteCoordinatesIndexes = arrayUnique(
    points
      .filter(p => p.x === 0 || p.x === xMax || p.y === 0 || p.y === yMax)
      .map(p => p.closestCoordinateIndex),
  );

  const largestNonInfiniteCoordinates = coordinates
    .filter(c => !infiniteCoordinatesIndexes.includes(c.index))
    .map(c => {
      const count = points.filter(p => p.closestCoordinateIndex === c.index).length;
      return { ...c, count };
    })
    .sort((a, b) => b.count - a.count)
    .shift();

  return largestNonInfiniteCoordinates;
};

const test = () => {
  const largestNonInfiniteArea = getLargestNonInfiniteArea(testInput);
  assert.equal(largestNonInfiniteArea.count, 17);
};

const run = () => {
  const largestNonInfiniteArea = getLargestNonInfiniteArea(input);
  console.log(largestNonInfiniteArea.count);
};

test();

run();
