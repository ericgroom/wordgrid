const jwt = require("jsonwebtoken");
const utils = require("./utils");
const db = require("../queries/users");
const emitters = require("../emitters");

exports.changeNickname = async (socket, nickname) => {
  const user = await utils.getCurrentUser(socket);
  await db.updateUser(user.id, { nickname });
  emitters.user.sendNickname(socket, nickname);
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

exports.registerListeners = socket => {
  socket.on("nickname", async nickname => {
    console.log(`${socket.id} changes nickname to: ${nickname}`);
    await exports.changeNickname(socket, nickname);
  });
  socket.on("auth", async (token, fn) => {
    console.log(`${socket.id} authenticates: existing user`);
    const success = await exports.authenticate(socket, token);
    fn(success);
  });
  socket.on("new auth", async fn => {
    console.log(`${socket.id} authenticates: new anonymous user`);
    const success = await exports.authenticateAnonymous(socket);
    fn(success);
  });
};
