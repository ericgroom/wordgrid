/**
 * Asks a client for their auth token
 *
 * @param {object} socket socket instance
 * @returns {Promise<string>} the auth token
 */
exports.demandAuthToken = socket => {
  return new Promise(resolve => {
    socket.emit("give token", token => {
      resolve(token);
    });
  });
};

exports.sendNickname = (socket, nickname) => {
  socket.emit("nickname", nickname);
};

exports.sendToken = (socket, token) => {
  socket.emit("token", token);
};
