const path = require("path");
const fs = require("fs");

const wordsPath = path.join(__dirname, "..", "words_alpha_opt.txt");
const triePath = path.join(__dirname, "..", "trie.json");
function readWords() {
  return new Promise((resolve, reject) => {
    fs.readFile(wordsPath, "utf-8", (err, data) => {
      if (err) reject("err");
      resolve(data.split("\n"));
    });
  });
}

function createTrie(words) {
  let trie = {};
  words.forEach(word => {
    let curr = trie;
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      if (!(letter in curr)) {
        curr[letter] = {};
      }
      curr = curr[letter];
    }
    curr["end"] = true;
  });
  return trie;
}

function getTrie(writeIfNotExists = true) {
  return new Promise((resolve, reject) => {
    fs.readFile(triePath, "utf-8", function(err, data) {
      if (data) {
        console.log("reading premade trie");
        const obj = JSON.parse(data);
        resolve(obj);
      } else {
        console.log("creating new trie");
        readWords()
          .then(words => {
            const trie = createTrie(words);
            if (writeIfNotExists) {
              console.log("writing");
              const json = JSON.stringify(trie);
              fs.writeFile(triePath, json, "utf-8", err => {
                if (err) reject(err);
              });
            }
            resolve(trie);
          })
          .catch(err => reject(err));
      }
    });
  });
}

function wordInTrie(word, trie) {
  let curr = trie;
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    if (!(letter in curr)) return false;
    curr = curr[letter];
  }
  return "end" in curr;
}

function validateWord(word, trie) {
  const inTrie = wordInTrie(word, trie);
  const large = word.length >= 3;
  const valid = inTrie && large;
  const score = valid ? word.length * 10 : 0;
  return { valid, score };
}

module.exports = {
  validateWord,
  getTrie
};
