const emitters = require("../emitters");
const utils = require("./utils");

exports.onChatMessage = async (io, socket, message, gameId) => {
  const user = await utils.getCurrentUser(socket, gameId);
  if (user.nickname) {
    emitters.messages.chatMessage(io, gameId, message, user);
  }
};
