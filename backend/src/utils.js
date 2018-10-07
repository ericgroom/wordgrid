const fs = require("fs");
const { createDbConnection, closeDbConnection } = require("./db");

function readWords() {
  return new Promise((resolve, reject) => {
    fs.readFile("../words_alpha.txt", "utf-8", (err, data) => {
      if (err) reject("err");
      resolve(data.split("\n"));
    });
  });
}

function groupWordsByFirstLetter(words) {
  return words.reduce((acc, elem) => {
    if (elem) {
      if (acc[elem[0]]) acc[elem[0]].push(elem);
      else acc[elem[0]] = [elem];
    }
    return acc;
  }, {});
}

function keyedObjectToArray(obj) {
  let arr = [];
  Object.keys(obj).forEach(key => {
    arr.push({ [key]: obj[key] });
  });
  return arr;
}

function populateDatabase() {
  readWords()
    .then(words => {
      console.log(typeof words);
      const wordMap = groupWordsByFirstLetter(words);
      const documents = keyedObjectToArray(wordMap);
      createDbConnection()
        .then(db => {
          db.collection("valid_words")
            .insertMany(documents)
            .then(data => {
              console.log(`inserted ${data.result.n} documents`);
              closeDbConnection();
            })
            .catch(err => {
              console.error(err);
              closeDbConnection();
            });
        })
        .catch(err => {
          console.error(err);
        });
    })
    .catch(err => {
      console.error(err);
    });
}

async function wordExists(word) {
  if (!word) return false;
  const query = { [word[0]]: word };
  console.log(query);
  const db = await createDbConnection();
  const count = await db
    .collection("valid_words")
    .find(query)
    .count();
  closeDbConnection();
  return count > 0;
}

wordExists("selfish").then(data => {
  console.log(data);
});

module.exports = {
  wordExists
};
