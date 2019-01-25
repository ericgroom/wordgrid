const games = require("./games");
const users = require("./users");
const messages = require("./messages");

const registerListeners = (io, socket, trie) => {
  games.registerListeners(io, socket, trie);
  users.registerListeners(socket);
  messages.registerListeners(io, socket);
};

module.exports = { games, users, messages, registerListeners };
