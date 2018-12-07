const fs = require('fs');
const assert = require('assert');

const inputFilename = './day-7.txt';

const inputFormat = /\s([A-Z])\s.*\s([A-Z])\s/;

const input = fs
  .readFileSync(inputFilename, 'utf8')
  .trim()
  .split('\n');

const testInput = [
  'Step C must be finished before step A can begin.',
  'Step C must be finished before step F can begin.',
  'Step A must be finished before step B can begin.',
  'Step A must be finished before step D can begin.',
  'Step B must be finished before step E can begin.',
  'Step D must be finished before step E can begin.',
  'Step F must be finished before step E can begin.',
];

const arrayFlatten = array => [].concat(...array);

const arrayUnique = array => [...new Set(array)];

const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));

const getParsedSteps = input => {
  const steps = {};
  for (const line of input) {
    const match = inputFormat.exec(line);
    if (match) {
      const [, parentStep, childStep] = match;
      steps[childStep] = steps[childStep] || [];
      steps[childStep].push(parentStep);
    }
  }
  return steps;
};

const completeSteps = steps => {
  const stepIds = arrayUnique([
    ...Object.keys(steps),
    ...arrayFlatten(Object.values(steps)),
  ]).sort();

  const completedSteps = [];

  do {
    for (const char of stepIds) {
      if (completedSteps.includes(char)) {
        continue;
      }
      if (!steps[char] || difference(steps[char], completedSteps).length === 0) {
        completedSteps.push(char);
        break;
      }
    }
  } while (completedSteps.length < stepIds.length);

  return completedSteps;
};

const test = () => {
  const parsedSteps = getParsedSteps(testInput);
  const completedSteps = completeSteps(parsedSteps);
  assert.equal(completedSteps.join(''), 'CABDFE');
};

const run = () => {
  const parsedSteps = getParsedSteps(input);
  console.log(parsedSteps);
  const completedSteps = completeSteps(parsedSteps);
  console.log(completedSteps.join(''));
};

test();

run();
