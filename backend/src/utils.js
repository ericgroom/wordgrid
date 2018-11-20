const _ = require("lodash");
const c = require("./constants");

function randInt(from, to) {
  return Math.floor(Math.random() * to) + from;
}

function choose(choices) {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function generateBoard() {
  const numVowels = randInt(3, 6);
  const vowels = _.times(numVowels, () => choose(c.vowels));
  const numConsonants = 16 - numVowels;
  const consonants = _.times(numConsonants, () => choose(c.consonants));
  return _.shuffle([...vowels, ...consonants]);
}

module.exports = {
  generateBoard,
  choose,
  randInt
};
