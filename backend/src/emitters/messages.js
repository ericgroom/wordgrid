exports.chatMessage = (io, gameId, message, sender) => {
  io.of("/game")
    .in(`${gameId}`)
    .emit("chat message", { message, sender: sender.nickname });
};
