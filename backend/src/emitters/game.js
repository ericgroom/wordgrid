exports.notExists = socket => socket.emit("not exists");

exports.stateUpdate = (io, gameId, state) => {
  io.of("/game")
    .to(`${gameId}`)
    .emit("state", state);
};

exports.timeRemaining = (socket, time) => {
  socket.emit("remaining time", time);
};

exports.wordsPlayed = (socket, words) => {
  socket.emit("played words", words);
};

exports.updateWord = (socket, word) => {
  socket.emit("word", word);
};

exports.startCountdown = (io, gameId, duration) => {
  io.of("/game")
    .in(`${gameId}`)
    .emit("countdown", duration);
};

exports.endGame = (io, gameId) => {
  io.of("/game")
    .in(`${gameId}`)
    .emit("end game");
};
