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

const getAsleepGuardStats = parsedEntries => {
  const guardStatsMap = new Map();

  let guard, fallAsleepMinute;
  for (const entry of parsedEntries) {
    if (entry.label.includes('begins shift')) {
      guard = entry.label
        .replace('begins shift', '')
        .replace('Guard #', '')
        .trim();
    }
    if (entry.label === 'falls asleep') {
      fallAsleepMinute = entry.minute;
    }
    if (entry.label === 'wakes up') {
      guardStatsMap[guard] = guardStatsMap[guard] || { total: 0, times: [] };
      guardStatsMap[guard].total += entry.minute - fallAsleepMinute;
      guardStatsMap[guard].times.push({ start: fallAsleepMinute, end: entry.minute });
      fallAsleepMinute = null;
    }
  }

  return Object.entries(guardStatsMap).map(([key, value]) => ({
    guard: Number(key),
    ...value,
  }));
};

const getMostAsleepGuard = parsedEntries => {
  const asleepGuardStats = getAsleepGuardStats(parsedEntries);
  const mostAsleepEntry = asleepGuardStats.sort((a, b) => b.total - a.total).shift();
  return mostAsleepEntry.guard;
};

const getMostAsleepMinuteForGuard = (parsedEntries, guard, asleepGuardStats) => {
  asleepGuardStats = asleepGuardStats || getAsleepGuardStats(parsedEntries);

  const asleepSingleGuardStats = asleepGuardStats.find(entry => entry.guard === guard);

  const countMinutesMap = new Map();
  for (const time of asleepSingleGuardStats.times) {
    for (let i = time.start; i < time.end; i++) {
      countMinutesMap[i] = countMinutesMap[i] || 0;
      countMinutesMap[i]++;
    }
  }

  return Object.entries(countMinutesMap)
    .map(([key, value]) => ({ minute: Number(key), total: value }))
    .sort((a, b) => b.total - a.total)
    .shift();
};

const getMostAsleepGuardOnSpecificMinute = parsedEntries => {
  const asleepGuardStats = getAsleepGuardStats(parsedEntries);

  const guardsMostAsleepMinutes = asleepGuardStats.map(({ guard }) => {
    const { minute, total } = getMostAsleepMinuteForGuard(parsedEntries, guard, asleepGuardStats);
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
    'What is the ID of the guard you chose multiplied by the minute you chose?',
    mostAsleepGuardOnSpecificMinute.guard * mostAsleepGuardOnSpecificMinute.minute,
  );
};

test();

run();
