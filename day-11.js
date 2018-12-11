const assert = require('assert');

const powerLevelForPoint = (x, y, serialNumber) => {
  // Find the fuel cell's rack ID, which is its X coordinate plus 10.
  const rackId = x + 10;
  // Begin with a power level of the rack ID times the Y coordinate.
  let powerLevel = rackId * y;
  // Increase the power level by the value of the grid serial number
  powerLevel += serialNumber;
  // Set the power level to itself multiplied by the rack ID.
  powerLevel = powerLevel * rackId;
  // Keep only the hundreds digit of the power level
  powerLevel = Number(powerLevel.toString().slice(-3, -2));
  // Subtract 5 from the power level.
  powerLevel = powerLevel - 5;

  return powerLevel;
};

const prepareGrid = (serialNumber, size = 300) => {
  const grid = {};

  for (let y = 1; y <= size; y++) {
    for (let x = 1; x <= size; x++) {
      grid[y] = grid[y] || {};
      grid[y][x] = powerLevelForPoint(x, y, serialNumber);
    }
  }

  return grid;
};

const largestSquare = (grid, size = 300) => {
  let max = { totalPower: 0 };
  for (let x = 1; x <= size; x++) {
    for (let y = 1; y <= size; y++) {
      let totalPower = 0;
      for (let n = y; n < y + 3 && n <= size; n++) {
        for (let p = x; p < x + 3 && p <= size; p++) {
          if (grid[n] && grid[n][p]) {
            totalPower += grid[n][p];
          }
        }
      }
      if (totalPower > max.totalPower) {
        max = { totalPower, x, y };
      }
    }
  }
  return max;
};

const test = () => {
  assert.strictEqual(powerLevelForPoint(3, 5, 8), 4);
  assert.strictEqual(powerLevelForPoint(122, 79, 57), -5);
  assert.strictEqual(powerLevelForPoint(217, 196, 39), 0);
  assert.strictEqual(powerLevelForPoint(101, 153, 71), 4);

  const grid18 = prepareGrid(18);
  const largest18 = largestSquare(grid18);
  assert.strictEqual(largest18.x, 33);
  assert.strictEqual(largest18.y, 45);
  assert.strictEqual(largest18.totalPower, 29);

  const grid42 = prepareGrid(42);
  const largest42 = largestSquare(grid42);
  assert.strictEqual(largest42.x, 21);
  assert.strictEqual(largest42.y, 61);
  assert.strictEqual(largest42.totalPower, 30);
};

const run = () => {
  const grid = prepareGrid(9995);
  const largest = largestSquare(grid);
  console.log(
    'What is the X,Y coordinate of the top-left fuel cell of the 3x3 square with the largest total power?',
    `${largest.x},${largest.y}`
  );
};

test();

run();
