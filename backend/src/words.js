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

/**
 * Checks if a word exists in a trie
 * @param {string} word word to check
 * @param {object} trie trie instance
 * @returns {boolean} true if word exists in trie
 */
function wordInTrie(word, trie) {
  let curr = trie;
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    if (!(letter in curr)) return false;
    curr = curr[letter];
  }
  return "end" in curr;
}

/**
 * Calculates the score for a given word.
 *
 * Note that this function doesn't do any validation!
 * @param {string} word word to score
 * @returns {number} score
 */
function scoreWord(word) {
  return word.length * 10;
}

/**
 * Determines if a word is a valid dictionary word
 * @param {string} word word to validate
 * @param {object} trie trie instance
 * @returns {boolean} validity
 */
function validateWord(word, trie) {
  const inTrie = wordInTrie(word, trie);
  const large = word.length >= 3;
  return inTrie && large;
}

/**
 * Converts a flat array index into a 2d coordinate
 * @param {number} index index in array
 * @param {number} size size of the square grid
 * @returns {Object} coord
 */
function indexToXY(index, size) {
  return {
    x: index % size,
    y: Math.floor(index / size)
  };
}

/**
 * Converts a 2d coordinate into a flat array index
 * @param {Object} coord x, y coordinate
 * @param {number} size size of the square grid
 * @returns {number} index
 */
function XYToIndex(coord, size) {
  return coord.y * size + coord.x;
}

/**
 * Curried function that can be passed to bfs for simple square grid
 * @param {number} index array index to find neighbors for
 * @param {number} size size of grid
 * @returns function that takes index
 */
function gridNeighbors(size) {
  return function(index) {
    const { x, y } = indexToXY(index, size);
    let neighbors = [];
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        const newX = x + dx;
        const newY = y + dy;
        if (
          newX >= 0 &&
          newX < size &&
          newY >= 0 &&
          newY < size &&
          (newX !== x || newY !== y)
        ) {
          const index = XYToIndex(
            {
              x: newX,
              y: newY
            },
            size
          );
          // trick to prefer straight lines over diagonal lines
          // iff the two have equal distances
          if (dx === 0 || dy === 0) {
            neighbors.unshift(index);
          } else {
            neighbors.push(index);
          }
        }
      }
    }
    return neighbors;
  };
}

// currently there is only one grid size, so creates a shortcut
const gridNeighborsFor4 = gridNeighbors(4);
const neighborsFor = index => gridNeighborsFor4(index);

/**
 * Determines if a path taken to create a word is valid for a given grid.
 *
 * Checks to make sure the path and word match, that the path is walkable, etc.
 * @param {string} word word played
 * @param {[number]} path array of indicies correlating to the word played in a grid
 * @param {[string]} grid grid the word was played in
 * @returns {boolean} true if path is valid
 */
function validatePath(word, path, grid) {
  // assert path is the same length as word
  if (word.length !== path.length) return false;
  // assert that the letter indexes in path actually match the correct letters in grid
  const lettersMatch = path.every(
    (gridPos, index) => word[index] === grid[gridPos]
  );
  if (!lettersMatch) return false;
  // validate that the path is walkable
  let curr = 0;
  let end = path[path.length - 1];
  while (curr < path.length && path[curr] !== end) {
    const gridPos = path[curr];
    const next = curr + 1;
    const neighbors = neighborsFor(gridPos);
    if (!neighbors.includes(path[next])) return false;
    curr = next;
  }
  // if the path was walked to the end then the path is valid
  if (path[curr] === end) return true;
  return false;
}

/**
 * Shortcut to check if a word is a valid dictionary word and if a valid path was taken
 * @param {string} word word played
 * @param {[number]} path path taken to play word
 * @param {[string]} grid grid word was played in
 * @param {object} trie trie instance
 * @returns {boolean} true if both word and path are valid, false otherwise
 */
function validateWordAndPath(word, path, grid, trie) {
  const validWord = validateWord(word, trie);
  const validPath = (function() {
    // if the word is invalid there is no point in validating the path which is more expensive
    if (!validWord) return false;
    const isValidPath = validatePath(word, path, grid);
    return isValidPath;
  })();
  return validWord && validPath;
}

module.exports = {
  validateWord,
  getTrie,
  validatePath,
  validateWordAndPath,
  scoreWord
};
