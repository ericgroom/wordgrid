const jwt = require("jsonwebtoken");
const _ = require("lodash");
const db = require("./queries");
const { generateBoard } = require("./utils");
const { validateWord } = require("./words");

function stripWordsFromGame(game) {
  const users = game.users.map(user => _.omit(user, "words"));
  return { ...game, users };
}

exports.onGameJoin = async (io, socket, gameId) => {
  try {
    const game = await db.getGame(gameId);
    if (!game) {
      socket.emit("not exists");
    }
    socket.join(`${gameId}`);
    const { id: userId, nickname } = await db.getCurrentUser(socket);
    // add user to game unless they have already been added or the game has ended
    try {
      await db.joinGame(userId, gameId);
    } catch (e) {
      console.log(`${userId} already a member of game: ${gameId}`);
    }
    const gameState = await db.getGame(gameId);
    console.log("state: ", gameState);
    // const strippedGameState = gameState.ended
    //   ? gameState
    //   : stripWordsFromGame(gameState);
    io.of("/game")
      .to(`${gameId}`)
      .emit("state", gameState);
  } catch (err) {
    console.error(err);
  }
};

exports.onWordSubmitted = async (io, socket, trie, word, gameId) => {
  // 1. validate word
  const { valid, score } = validateWord(word.word, trie);
  // 2. get game object
  const game = await db.getGame(gameId, false);
  // 3. ensure game is still active
  if (game.ended) return;
  // 4. add word to list of words played, update scores
  const { id: userId } = await db.getCurrentUser(socket);
  if (valid) {
    const validWord = { word: word.word, valid, score, id: word.id };
    await db.addWord(validWord, userId, gameId);
    await db.updateScore(userId, gameId);
  }
  // 5. send word back to sender
  socket.emit("word", { valid, id: word.id, score });
};

exports.startCountdown = async (io, socket, gameId) => {
  await db.updateGame(gameId, { countdown: true });
  const countdownDuration = 3;
  io.of("/game")
    .in(`${gameId}`)
    .emit("countdown", countdownDuration);
  return countdownDuration;
};

exports.onGameStart = async (io, socket, gameId) => {
  const grid = generateBoard();
  await db.updateGame(gameId, { grid: grid.join(""), started: true });
  const gameWithStart = await db.startGame(gameId);
  io.of("/game")
    .in(`${gameId}`)
    .emit("state", gameWithStart);
  const { duration = 60 } = gameWithStart;
  // timeout to end the game
  setTimeout(async () => {
    console.log(`ending game: ${gameId}`);
    await db.updateGame(gameId, { ended: true });
    io.of("/game")
      .in(`${gameId}`)
      .emit("end game");
  }, duration * 1000);
  await db.getGameChanges(
    gameId,
    (err, game) => {
      if (err) throw err;
      // const newState = stripWordsFromGame(game);
      io.of("/game")
        .in(`${gameId}`)
        .emit("state", game);
      if (game.ended) {
        console.log("ending");
        return false; // exit callback loop
      }
      return true;
    },
    1.0 * 1000
  );
};

exports.onNicknameChange = async (socket, nickname) => {
  const user = await db.getCurrentUser(socket);
  console.log(user);
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
    const { id: userId } = await db.createUser({ socket_id: socket.id });
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
