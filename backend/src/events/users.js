const jwt = require("jsonwebtoken");
const utils = require("./utils");
const db = require("../queries");
const emitters = require("../emitters");

exports.changeNickname = async (socket, nickname) => {
  const user = await utils.getCurrentUser(socket);
  await db.updateUser(user.id, { nickname });
  emitters.user.updateNickname(socket, nickname);
};

exports.authenticate = async (socket, token) => {
  try {
    const { userId } = await jwt.verify(token, process.env.APP_SECRET);
    await db.updateUser(userId, { socket_id: socket.id });
    console.log(`user ${userId} is now associated with socket ${socket.id}`);
    const { nickname } = await db.getUser(userId);
    emitters.user.sendNickname(socket, nickname);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.authenticateAnonymous = async socket => {
  try {
    const { id: userId } = await db.createUser({ socket_id: socket.id });
    const token = await jwt.sign({ userId }, process.env.APP_SECRET);
    emitters.user.sendToken(socket, token);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
