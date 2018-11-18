const fs = require("fs");

function readWords() {
  return new Promise((resolve, reject) => {
    fs.readFile("../words_alpha.txt", "utf-8", (err, data) => {
      if (err) reject("err");
      resolve(data.split("\n"));
    });
  });
}

module.exports = {
  readWords
};
