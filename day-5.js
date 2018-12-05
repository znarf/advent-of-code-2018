const fs = require('fs');
const assert = require('assert');

const inputFilename = './day-5.txt';

const input = fs.readFileSync(inputFilename, 'utf8').trim();

const testInput = 'dabAcCaCBAcCcaDA';

const reactionOccurs = (a, b) => a.toLowerCase() === b.toLowerCase() && a !== b;

const processReaction = string => {
  for (let i = 1; i < string.length; i++) {
    const char = string[i];
    const prevChar = string[i - 1];
    if (reactionOccurs(prevChar, char)) {
      return string.slice(0, i - 1) + string.slice(i + 1);
    }
  }
};

const processReactions = string => {
  while (true) {
    resultingString = processReaction(string);
    if (!resultingString) {
      return string;
    }
    string = resultingString;
  }
};

const test = () => {
  const processedString = processReactions(testInput);
  // Part one
  assert.equal(processedString, 'dabCBAcaDA');
  assert.equal(processedString.length, 10);
};

const run = () => {
  const processedString = processReactions(input);
  // Part one
  console.log(
    'How many units remain after fully reacting the polymer you scanned?',
    processedString.length,
  );
};

test();

run();
