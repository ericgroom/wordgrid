const fs = require("fs");
const _ = require("lodash");
const c = require("./constants");

function readWords() {
  return new Promise((resolve, reject) => {
    fs.readFile("../words_alpha.txt", "utf-8", (err, data) => {
      if (err) reject("err");
      resolve(data.split("\n"));
    });
  });
}

function randInt(from, to) {
  return Math.floor(Math.random() * to) + from;
}

function choose(choices) {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function generateBoard() {
  const numVowels = randInt(2, 6);
  const vowels = _.times(numVowels, () => choose(c.vowels));
  const numConsonants = 16 - numVowels;
  const consonants = _.times(numConsonants, () => choose(c.consonants));
  return _.shuffle([...vowels, ...consonants]);
}

module.exports = {
  readWords,
  generateBoard
};
