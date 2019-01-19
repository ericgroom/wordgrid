const io = require("socket.io");
const eventHandlers = require("./events");

exports.createServer = function(httpServer) {
  return io(httpServer, {
    origins: ["https://wordgrid.app:*"]
  });
};

exports.attachListeners = function(io, trie) {
  io.of("/game").on("connection", async function(socket) {
    console.log("user connected to /game");
    eventHandlers.registerListeners(io, socket, trie);
  });
};
