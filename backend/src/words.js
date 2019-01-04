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

const gridNeighborsFor4 = gridNeighbors(4);
const neighborsFor = index => gridNeighborsFor4(index);

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

module.exports = {
  validateWord,
  getTrie,
  validatePath
};
