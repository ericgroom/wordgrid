const io = require("socket.io");
const eventHandlers = require("./events");

exports.createServer = function(httpServer) {
  return io(httpServer);
};

exports.attachListeners = function(io, trie) {
  io.of("/game").on("connection", async function(socket) {
    console.log("user connected to /game");
    socket.on("join game", async ({ id }) => {
      console.log(`${socket.id} joins game: ${id}`);
      await eventHandlers.game.onGameJoin(io, socket, id);
    });
    socket.on("word", async ({ word, id: wordId, path }, gameId) => {
      console.log(`${socket.id} plays word: ${word} in game: ${gameId}`);
      await eventHandlers.game.onWordSubmitted(
        socket,
        trie,
        { word, id: wordId, path },
        gameId
      );
    });
    socket.on("game start", async ({ id }) => {
      const countdown = await eventHandlers.game.startCountdown(io, id);
      setTimeout(async () => {
        console.log(`${socket.id} starts game: ${id}`);
        await eventHandlers.game.onGameStart(io, id);
      }, countdown * 1000);
    });
    socket.on("nickname", async nickname => {
      console.log(`${socket.id} changes nickname to: ${nickname}`);
      await eventHandlers.users.changeNickname(socket, nickname);
    });
    socket.on("auth", async (token, fn) => {
      console.log(`${socket.id} authenticates: existing user`);
      const success = await eventHandlers.users.authenticate(socket, token);
      fn(success);
    });
    socket.on("new auth", async fn => {
      console.log(`${socket.id} authenticates: new anonymous user`);
      const success = await eventHandlers.users.authenticateAnonymous(socket);
      fn(success);
    });
    socket.on("leave game", gameId => {
      console.log(`socket ${socket.id} leaves game: ${gameId}`);
      socket.leave(gameId);
    });
    socket.on("chat message", async ({ message, gameId }) => {
      console.log(`${socket.id} sends message: ${message}`);
      await eventHandlers.messages.onChatMessage(io, socket, message, gameId);
    });
  });
};
