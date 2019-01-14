const emitters = require("../emitters");
const utils = require("./utils");

exports.onChatMessage = async (io, socket, message, gameId) => {
  const user = await utils.getCurrentUser(socket, gameId);
  if (user.nickname) {
    emitters.messages.chatMessage(io, gameId, message, user);
  }
};

exports.registerListeners = (io, socket) => {
  socket.on("chat message", async ({ message, gameId }) => {
    console.log(`${socket.id} sends message: ${message}`);
    await exports.onChatMessage(io, socket, message, gameId);
  });
};
