const game = require("./game");
const users = require("./users");
const messages = require("./messages");

const registerListeners = (io, socket, trie) => {
  game.registerListeners(io, socket, trie);
  users.registerListeners(socket);
  messages.registerListeners(io, socket);
};

module.exports = { game, users, messages, registerListeners };
