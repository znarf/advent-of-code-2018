const fs = require('fs');

const inputFilename = './day-10.txt';
const testIputFilename = './day-10-test.txt';

const inputFormat = /<([\d\s-,]*)>.*<([\d\s-,]*)>/;

const input = fs
  .readFileSync(inputFilename, 'utf8')
  .trim()
  .split('\n');

const testInput = fs
  .readFileSync(testIputFilename, 'utf8')
  .trim()
  .split('\n');

const parseLine = line => {
  const match = inputFormat.exec(line);
  if (match) {
    let [, position, velocity] = match;
    position = position
      .split(',')
      .map(s => s.trim())
      .map(Number);
    velocity = velocity
      .split(',')
      .map(s => s.trim())
      .map(Number);
    return { position, velocity };
  }
};

const draw = points => {
  const xMin = Math.min(...points.map(p => p.position[0]));
  const xMax = Math.max(...points.map(p => p.position[0]));
  const yMin = Math.min(...points.map(p => p.position[1]));
  const yMax = Math.max(...points.map(p => p.position[1]));

  const pointMap = {};
  for (const point of points) {
    const [pX, pY] = point.position;
    pointMap[pX] = pointMap[pX] || {};
    pointMap[pX][pY] = true;
  }

  for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      if (pointMap[x] && pointMap[x][y]) {
        process.stdout.write('X');
      } else {
        process.stdout.write(' ');
      }
    }
    process.stdout.write('\n');
  }
};

const calculateDrawSize = points => {
  const xMin = Math.min(...points.map(p => p.position[0]));
  const xMax = Math.max(...points.map(p => p.position[0]));
  const yMin = Math.min(...points.map(p => p.position[1]));
  const yMax = Math.max(...points.map(p => p.position[1]));

  return Math.abs(xMax - xMin) + Math.abs(yMax - yMin);
};

const drawSmallest = points => {
  let drawSize, nextDrawsize, nextPoints;
  let i = 0;
  while (true) {
    nextPoints = calculateNextPoints(points);
    nextDrawsize = calculateDrawSize(nextPoints);
    if (drawSize && nextDrawsize >= drawSize) {
      break;
    }
    drawSize = nextDrawsize;
    points = nextPoints;
    i++;
  }
  console.log(i, 'seconds');
  draw(points);
};

const calculateNextPoints = points =>
  points.map(point => {
    return {
      position: [point.position[0] + point.velocity[0], point.position[1] + point.velocity[1]],
      velocity: point.velocity
    };
  });

const test = () => {
  const points = testInput.map(parseLine);
  drawSmallest(points);
};

const run = () => {
  const points = input.map(parseLine);
  drawSmallest(points);
};

test();

run();
