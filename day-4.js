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

const getMostAsleepMinuteForGuard = (parsedEntries, guard, guardsAsleepTimes) => {
  guardsAsleepTimes = guardsAsleepTimes || getGuardsAsleepTimes(parsedEntries);

  const singleGuardAsleepTimes = guardsAsleepTimes[guard];

  if (singleGuardAsleepTimes.times.length === 0) {
    return { guard, minute: 0, total: 0 };
  }

  const countMinutes = {};
  for (const time of singleGuardAsleepTimes.times) {
    for (let i = time.start; i < time.end; i++) {
      countMinutes[i] = countMinutes[i] || 0;
      countMinutes[i]++;
    }
  }

  const mostAsleepMinuteForGuard = Object.entries(countMinutes)
    .map(entry => ({ minute: Number(entry[0]), total: entry[1] }))
    .sort((a, b) => b.total - a.total)
    .shift();

  return mostAsleepMinuteForGuard;
};

const getMostAsleepGuardOnSpecificMinute = parsedEntries => {
  const guardsAsleepTimes = getGuardsAsleepTimes(parsedEntries);

  const guardsMostAsleepMinutes = Object.keys(guardsAsleepTimes).map(guard => {
    guard = Number(guard);
    const { minute, total } = getMostAsleepMinuteForGuard(parsedEntries, guard, guardsAsleepTimes);
    return { guard, minute, total };
  });

  return guardsMostAsleepMinutes.sort((a, b) => b.total - a.total).shift();
};

const test = () => {
  const parsedTestEntries = testEntries.map(parseEntry);
  // Part one
  const mostAsleepGuard = getMostAsleepGuard(parsedTestEntries);
  assert.equal(mostAsleepGuard, 10);
  const mostAsleepMinuteForGuard = getMostAsleepMinuteForGuard(parsedTestEntries, mostAsleepGuard);
  assert.equal(mostAsleepMinuteForGuard.minute, 24);
  // Part two
  const mostAsleepGuardOnSpecificMinute = getMostAsleepGuardOnSpecificMinute(parsedTestEntries);
  assert.equal(mostAsleepGuardOnSpecificMinute.guard, 99);
  assert.equal(mostAsleepGuardOnSpecificMinute.minute, 45);
};

const run = () => {
  const parsedEntries = entries.map(parseEntry);
  // Part one
  const mostAsleepGuard = getMostAsleepGuard(parsedEntries);
  console.log('Find the guard that has the most minutes asleep.', mostAsleepGuard);
  const mostAsleepMinuteForGuard = getMostAsleepMinuteForGuard(parsedEntries, mostAsleepGuard);
  console.log(
    'What minute does that guard spend asleep the most?',
    mostAsleepMinuteForGuard.minute,
  );
  console.log(
    'What is the ID of the guard you chose multiplied by the minute you chose?',
    mostAsleepGuard * mostAsleepMinuteForGuard.minute,
  );
  // Part two
  const mostAsleepGuardOnSpecificMinute = getMostAsleepGuardOnSpecificMinute(parsedEntries);
  console.log(
    'Of all guards, which guard is most frequently asleep on the same minute?',
    mostAsleepGuardOnSpecificMinute,
  );
  console.log(
    'What is the ID of the guard you chose multiplied by the minute you chose?',
    mostAsleepGuardOnSpecificMinute.guard * mostAsleepGuardOnSpecificMinute.minute,
  );
};

test();

run();
