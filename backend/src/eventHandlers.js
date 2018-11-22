const db = require("./queries");
const jwt = require("jsonwebtoken");

exports.onGameJoin = async (socket, gameId) => {
  try {
    const game = await db.getGame(gameId);
    if (game) {
      socket.emit("state", game);
    } else {
      socket.emit("not exists");
    }
    socket.join(`${gameId}`);
    const cursor = await db.filterUsers({ socket_id: socket.id });
    const user = await cursor.next();
    const nickname = user.nickname;
    socket.broadcast.to(`${gameId}`).emit("user join", nickname);
  } catch (err) {
    console.error(err);
  }
};

exports.onWordSubmitted = async (io, socket, word, gameId) => {
  const { valid, score } = validateWord(word, trie);
  // TODO will need to ascociate with user somehow
  io.of("/game")
    .to(`${gameId}`)
    .emit("word", { valid, id: wordId, score });
};

exports.onGameStart = async (io, socket, gameId) => {
  const board = generateBoard();
  await db.updateGame(gameId, { board, countdown: true, started: true });
  const game = db.getGame(gameId);
  io.of("/game")
    .in(`${gameId}`)
    .emit("state", game);
};

exports.onNicknameChange = async (socket, nickname) => {
  const cursor = await db.filterUsers({ socket_id: socket.id });
  const user = await cursor.next();
  await db.updateUser(user.id, { nickname });
  socket.emit("nickname", nickname);
};

exports.onAuthentication = async (socket, token) => {
  try {
    const { userId } = await jwt.verify(token, process.env.APP_SECRET);
    await db.updateUser(userId, { socket_id: socket.id });
    const userObj = await db.getUser(userId);
    socket.emit("nickname", userObj.nickname);
  } catch (e) {
    console.error(e);
  }
};

exports.onAuthenticateAnonymous = async socket => {
  try {
    const userObj = await db.createUser({ socket_id: socket.id });
    const userId = userObj.generated_keys[0];
    const token = await jwt.sign({ userId }, process.env.APP_SECRET);
    socket.emit("token", token);
  } catch (e) {
    console.error(e);
  }
};

exports.onChatMessage = async (io, socket, message) => {
  const result = await db.createMessage({ message });
  const id = result.generated_keys[0];
  io.of("/chat").emit("chat message", { message, id });
};
