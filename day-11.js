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

const prepareGrid = (serialNumber, gridSize = 300) => {
  const grid = [];

  for (let y = 0; y < gridSize; y++) {
    const line = [];
    for (let x = 0; x < gridSize; x++) {
      line.push(powerLevelForPoint(x + 1, y + 1, serialNumber));
    }
    grid.push(line);
  }

  return grid;
};

const largestSquare = (grid, gridSize = 300, squareSize = 3) => {
  let max = { totalPower: 0 };
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      let totalPower = 0;
      for (let n = y; n < y + squareSize && n < gridSize; n++) {
        for (let p = x; p < x + squareSize && p < gridSize; p++) {
          totalPower += grid[n][p];
        }
      }
      if (totalPower > max.totalPower) {
        max = { totalPower, x: x + 1, y: y + 1 };
      }
    }
  }
  return max;
};

const largestSquareForAnySize = (grid, gridSize = 300) => {
  let maxForAnySize = { totalPower: 0 };
  for (let size = 1; size <= 300; size++) {
    const max = largestSquare(grid, gridSize, size);
    console.log({ size, ...max });
    if (max.totalPower > maxForAnySize.totalPower) {
      maxForAnySize = { size, ...max };
    }
  }
  return maxForAnySize;
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

  const largestForAnySize18 = largestSquareForAnySize(grid18);
  assert.strictEqual(largestForAnySize18.x, 90);
  assert.strictEqual(largestForAnySize18.x, 269);
  assert.strictEqual(largestForAnySize18.size, 16);
  assert.strictEqual(largestForAnySize18.totalPower, 113);

  const grid42 = prepareGrid(42);

  const largest42 = largestSquare(grid42);
  assert.strictEqual(largest42.x, 21);
  assert.strictEqual(largest42.y, 61);
  assert.strictEqual(largest42.totalPower, 30);

  const largestForAnySize42 = largestSquareForAnySize(grid42);
  assert.strictEqual(largestForAnySize42.x, 232);
  assert.strictEqual(largestForAnySize42.x, 251);
  assert.strictEqual(largestForAnySize42.size, 12);
  assert.strictEqual(largestForAnySize42.totalPower, 119);
};

const run = () => {
  const grid = prepareGrid(9995);
  console.log(grid);
  const largest = largestSquare(grid);
  console.log(
    'What is the X,Y coordinate of the top-left fuel cell of the 3x3 square with the largest total power?',
    `${largest.x},${largest.y}`
  );
  const largestForAnySize = largestSquareForAnySize(grid);
  console.log(
    'What is the X,Y,size identifier of the square with the largest total power?',
    `${largestForAnySize.x},${largestForAnySize.y},${largestForAnySize.size}`
  );
};

test();

run();
