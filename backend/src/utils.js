const _ = require("lodash");
const c = require("./constants");

function randInt(from, to) {
  return Math.floor(Math.random() * to) + from;
}

function choose(choices) {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

/**
 * Board generating algorithm based on randomly selecting
 * vowels and consonants. Plan to replace
 */
function generateBoard() {
  const numVowels = randInt(3, 6);
  const vowels = _.times(numVowels, () => choose(c.vowels));
  const numConsonants = 16 - numVowels;
  const consonants = _.times(numConsonants, () => choose(c.consonants));
  return _.shuffle([...vowels, ...consonants]);
}

/**
 * Board generating algorithm based on letter frequencies.
 */
function generateBoardFrequencies() {
  const totalWeights = _.sum(Object.values(c.frequencies));
  const board = _.times(16, () => {
    const entries = Object.entries(c.frequencies);
    const num = Math.random();
    let acc = 0;
    let letterAcc = entries[0][0];
    for (let i = 0; acc < num && i < entries.length; i++) {
      const [letter, freq] = entries[i];
      const normalizedFreq = freq / totalWeights;
      letterAcc = letter;
      acc += normalizedFreq;
    }
    return letterAcc;
  });
  return board;
}

module.exports = {
  generateBoard,
  choose,
  randInt,
  generateBoardFrequencies
};
