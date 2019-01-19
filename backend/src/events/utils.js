const jwt = require("jsonwebtoken");
const emitters = require("../emitters");
const db = require("../queries/users");

/**
 * Gets the currently logged in user.
 *
 * For most cases, the client will authenticate with the server. However, in some
 * cases, the server will lose track of which socket id corresponds to which user.
 * This happens most often when the server restarts or a client has the webpage open
 * for long enough that the socket disconnects and reconnects later.
 *
 * This function will first try to get a user from the database based on their
 * socket id, and then if unsuccessful will ask the client to provide their auth token.
 *
 * @param {number} rejoinGameId gameId to rejoin socket if disconnected
 * @returns {Promise<User>} User model instance
 */
exports.getCurrentUser = async (socket, rejoinGameId) => {
  const user = await db.getCurrentUser(socket);
  if (!user) {
    const token = await emitters.user.demandAuthToken(socket);
    const { userId } = await jwt.verify(token, process.env.APP_SECRET);
    const user = await db.updateUser(userId, { socket_id: socket.id });
    if (rejoinGameId) {
      socket.join(`${rejoinGameId}`);
    }
    return user;
  } else {
    return user;
  }
};
