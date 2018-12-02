const fs = require('fs');

const inputFilename = './day-2.txt';

const idsLength = 26;

const ids = fs
  .readFileSync(inputFilename, 'utf8')
  .trim()
  .split('\n');

const characterCount = string =>
  string.split('').reduce((acc, value) => {
    acc[value] = acc[value] + 1 || 1;
    return acc;
  }, {});

const idsWithCharacterCount = ids.map(id => ({
  id,
  characterCount: characterCount(id),
}));

const idsWithCharacterCountTwo = idsWithCharacterCount.filter(entry =>
  Object.values(entry.characterCount).some(count => count === 2),
);

const idsWithCharacterCountThree = idsWithCharacterCount.filter(entry =>
  Object.values(entry.characterCount).some(count => count === 3),
);

console.log(
  'What is the checksum for your list of box IDs?',
  idsWithCharacterCountTwo.length * idsWithCharacterCountThree.length,
);

const findIdsWithOnlyOneCharacterDifference = ids => {
  for (const id1 of ids) {
    for (const id2 of ids) {
      if (id1 === id2) {
        continue;
      }
      const same = [];
      for (let i = 0; i < idsLength; i++) {
        if (id1[i] === id2[i]) {
          same.push(id1[i]);
        }
      }
      if (same.length === idsLength - 1) {
        return { id1, id2, same };
      }
    }
  }
};

const idsWithOnlyOneCharacterDifference = findIdsWithOnlyOneCharacterDifference(ids);

console.log(
  'What letters are common between the two correct box IDs?',
  idsWithOnlyOneCharacterDifference.same.join(''),
);
