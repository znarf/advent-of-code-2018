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
    const id = parseInt(match[1], 10);
    const position = match[2].split(',').map(s => parseInt(s, 10));
    const size = match[3].split('x').map(s => parseInt(s, 10));
    return { id, position, size };
  }
};

const findMatchingEntries = entries => {
  const duplicates = {};
  const length = entries.length;
  for (let i = 0; i < length; i++) {
    const firstEntry = entries[i];
    console.log(`Processing #${firstEntry.id}`);
    const [firstEntryStartX, firstEntryStartY] = firstEntry.position;
    const [firstEntryWidth, firstEntryHeight] = firstEntry.size;
    for (let j = i + 1; j < length; j++) {
      const secondEntry = entries[j];
      const [secondEntryStartX, secondEntryStartY] = secondEntry.position;
      const [secondEntryWidth, secondEntryHeight] = secondEntry.size;
      for (let ix = firstEntryStartX; ix < firstEntryStartX + firstEntryWidth; ix++) {
        for (let iy = firstEntryStartY; iy < firstEntryStartY + firstEntryHeight; iy++) {
          for (let jx = secondEntryStartX; jx < secondEntryStartX + secondEntryWidth; jx++) {
            for (let jy = secondEntryStartY; jy < secondEntryStartY + secondEntryHeight; jy++) {
              if (ix === jx && iy === jy) {
                duplicates[`${ix},${iy}`] = true;
              }
            }
          }
        }
      }
    }
  }
  return Object.keys(duplicates);
};

const test = () => {
  const parsedTestEntries = testEntries.map(parseEntry);
  const testDuplicates = findMatchingEntries(parsedTestEntries);
  assert.equal(testDuplicates.length, 4);
};

const run = () => {
  const parsedEntries = entries.map(parseEntry);
  const duplicates = findMatchingEntries(parsedEntries);
  console.log('How many square inches of fabric are within two or more claims?', duplicates.length);
};

test();

run();
