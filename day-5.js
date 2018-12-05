const fs = require('fs');
const assert = require('assert');

const inputFilename = './day-5.txt';

const input = fs.readFileSync(inputFilename, 'utf8').trim();

const testInput = 'dabAcCaCBAcCcaDA';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

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

const findShortestReaction = string => {
  return alphabet
    .split('')
    .map(char => string.replace(new RegExp(char, 'ig'), ''))
    .map(processReactions)
    .sort((a, b) => a.length - b.length)
    .shift();
};

const test = () => {
  const processedString = processReactions(testInput);
  // Part one
  assert.equal(processedString, 'dabCBAcaDA');
  assert.equal(processedString.length, 10);
  // Part two
  const shortestReaction = findShortestReaction(testInput);
  assert.equal(shortestReaction, 'daDA');
  assert.equal(shortestReaction.length, 4);
};

const run = () => {
  const processedString = processReactions(input);
  // Part one
  console.log(
    'How many units remain after fully reacting the polymer you scanned?',
    processedString.length,
  );
  // Part two
  const shortestReaction = findShortestReaction(input);
  console.log(
    'What is the length of the shortest polymer you can produce?',
    shortestReaction.length,
  );
};

test();

run();
