const fs = require('fs');
const assert = require('assert');

const inputFilename = './day-4.txt';
const testInputFilename = './day-4-test.txt';

const inputFormat = /\[([\d\-]{10})\s([\d\:]{5})\]\s(.*)/;

const entries = fs
  .readFileSync(inputFilename, 'utf8')
  .trim()
  .split('\n')
  .sort();

const testEntries = fs
  .readFileSync(testInputFilename, 'utf8')
  .trim()
  .split('\n');

const parseEntry = entry => {
  const match = inputFormat.exec(entry);
  if (match) {
    const [, , time, label] = match;
    const [, minute] = time.split(':').map(Number);
    return { minute, label };
  }
};

const getGuardsAsleepTimes = parsedEntries => {
  const guardsAsleepTimes = {};
  let currentGuard, fallAsleepMinute;
  for (const entry of parsedEntries) {
    if (entry.label.includes('begins shift')) {
      currentGuard = Number(
        entry.label
          .replace('begins shift', '')
          .replace('Guard #', '')
          .trim(),
      );
      guardsAsleepTimes[currentGuard] = guardsAsleepTimes[currentGuard] || { total: 0, times: [] };
    }
    if (entry.label === 'falls asleep') {
      fallAsleepMinute = entry.minute;
    }
    if (entry.label === 'wakes up') {
      guardsAsleepTimes[currentGuard].total += entry.minute - fallAsleepMinute;
      guardsAsleepTimes[currentGuard].times.push({ start: fallAsleepMinute, end: entry.minute });
      fallAsleepMinute = null;
    }
  }
  return guardsAsleepTimes;
};

const getMostAsleepGuard = parsedEntries => {
  const guardsAsleepTimes = getGuardsAsleepTimes(parsedEntries);
  return Object.keys(guardsAsleepTimes).reduce((a, b) =>
    guardsAsleepTimes[a].total > guardsAsleepTimes[b].total ? a : b,
  );
};

const getMostAsleepMinuteForGuard = (parsedEntries, guard) => {
  const guardsAsleepTimes = getGuardsAsleepTimes(parsedEntries);
  const singleGuardAsleepTimes = guardsAsleepTimes[guard];

  const countMinutes = {};
  for (const time of singleGuardAsleepTimes.times) {
    for (let i = time.start; i < time.end; i++) {
      countMinutes[i] = countMinutes[i] || 0;
      countMinutes[i]++;
    }
  }

  return Object.keys(countMinutes).reduce((a, b) => (countMinutes[a] > countMinutes[b] ? a : b));
};

const test = () => {
  const parsedTestEntries = testEntries.map(parseEntry);
  assert.equal(getMostAsleepGuard(parsedTestEntries), 10);
  assert.equal(getMostAsleepMinuteForGuard(parsedTestEntries, 10), 24);
};

const run = () => {
  const parsedEntries = entries.map(parseEntry);
  const mostAsleepGuard = getMostAsleepGuard(parsedEntries);
  const mostAsleepMinuteForGuard = getMostAsleepMinuteForGuard(parsedEntries, mostAsleepGuard);
  console.log('Find the guard that has the most minutes asleep.', mostAsleepGuard);
  console.log('What minute does that guard spend asleep the most?', mostAsleepMinuteForGuard);
  console.log(
    'What is the ID of the guard you chose multiplied by the minute you chose?',
    mostAsleepGuard * mostAsleepMinuteForGuard,
  );
};

test();

run();
