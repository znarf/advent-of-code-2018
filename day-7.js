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

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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

const getStepIds = steps => {
  return (stepIds = arrayUnique([
    ...Object.keys(steps),
    ...arrayFlatten(Object.values(steps)),
  ]).sort());
};

const getStepsPlan = steps => {
  const stepIds = getStepIds(steps);

  const stepsPlan = [];

  do {
    for (const char of stepIds) {
      if (stepsPlan.includes(char)) {
        continue;
      }
      if (!steps[char] || difference(steps[char], stepsPlan).length === 0) {
        stepsPlan.push(char);
        break;
      }
    }
  } while (stepsPlan.length < stepIds.length);

  return stepsPlan;
};

const executeSteps = (steps, baseStepDuration = 0, nWorkers = 2) => {
  const stepIds = getStepIds(steps);

  let duration = 0;

  const workers = [];
  const executedSteps = [];

  do {
    stepIds: for (const stepId of stepIds) {
      // Item already processed
      if (executedSteps.includes(stepId)) {
        continue stepIds;
      }
      // Item not processable
      if (steps[stepId] && difference(steps[stepId], executedSteps).length > 0) {
        continue stepIds;
      }
      // Item already processing
      for (let i = 0; i < nWorkers; i++) {
        if (workers[i] && workers[i].stepId === stepId) {
          continue stepIds;
        }
      }
      // Try to find a worker for item
      for (let i = 0; i < nWorkers; i++) {
        if (!workers[i]) {
          workers[i] = { stepId, remaining: alphabet.indexOf(stepId) + 1 + baseStepDuration };
          continue stepIds;
        }
      }
    }

    // Update workers status
    for (let i = 0; i < nWorkers; i++) {
      if (workers[i]) {
        workers[i].remaining--;
        if (workers[i].remaining === 0) {
          executedSteps.push(workers[i].stepId);
          workers[i] = null;
        }
      }
    }

    duration++;
  } while (executedSteps.length < stepIds.length);

  return { totalDuration: duration };
};

const test = () => {
  const parsedSteps = getParsedSteps(testInput);
  const stepsPlan = getStepsPlan(parsedSteps);
  assert.equal(stepsPlan.join(''), 'CABDFE');
  const result = executeSteps(parsedSteps, 0, 2);
  assert.equal(result.totalDuration, 15);
};

const run = () => {
  const parsedSteps = getParsedSteps(input);
  const stepsPlan = getStepsPlan(parsedSteps);
  console.log(stepsPlan.join(''));
  const result = executeSteps(parsedSteps, 60, 5);
  console.log(result.totalDuration);
};

test();

run();
