const fs = require('fs');

const inputFilename = './day-1.txt';

const initialFrequency = 0;

const frequencies = fs
  .readFileSync(inputFilename, 'utf8')
  .trim()
  .split('\n')
  .map(s => parseInt(s, 10));

const resultingFrequency = () => frequencies.reduce((a, b) => a + b, initialFrequency);

const firstFrequencyReachedTwice = () => {
  let currentFrequency = initialFrequency;
  let reachedFrequencies = [];
  while (true) {
    for (const frequency of frequencies) {
      currentFrequency += frequency;
      if (reachedFrequencies.indexOf(currentFrequency) !== -1) {
        return currentFrequency;
      }
      reachedFrequencies.push(currentFrequency);
    }
  }
};

console.log('What is the resulting frequency?');
console.log(resultingFrequency());

console.log('What is the first frequency your device reaches twice?');
console.log(firstFrequencyReachedTwice());
