const jwt = require("jsonwebtoken");
const _ = require("lodash");
const db = require("./queries");
const { generateBoardFrequencies } = require("./utils");
const { validateWord } = require("./words");

exports.onGameJoin = async (io, socket, gameId) => {
  try {
    // 1. check if game exists
    const game = await db.getGame(gameId, { joinRelation: false });
    if (!game) {
      socket.emit("not exists");
    }
    socket.join(`${gameId}`);
    const user = await db.getCurrentUser(socket);
    if (!user) {
      console.log(`cannot find user for socket id ${socket.id}`);
      return;
    }
    const { id: userId, nickname } = user;
    // 2. check if game is ended
    const { ended, secondsRemaining } = await (async () => {
      let ended = game.ended;
      const now = new Date();
      if (game.ended_at === null) {
        return { ended, secondsRemaining: null };
      }
      const secondsRemaining = Math.floor((game.ended_at - now) / 1000);
      if (secondsRemaining < 0 && !ended) {
        await db.updateGame(gameId, { ended: true });
        ended = true;
      }
      return { ended, secondsRemaining };
    })();
    // 3. join game if not ended
    if (!ended) {
      try {
        await db.joinGame(userId, gameId);
      } catch (e) {
        console.log(`${userId} already a member of game: ${gameId}`);
      }
    }
    // 4. send current state
    const gameState = await db.getGame(gameId, {});
    io.of("/game")
      .to(`${gameId}`)
      .emit("state", gameState);
    // 5. send remaining time
    if (secondsRemaining) {
      socket.emit("remaining time", secondsRemaining);
    }
  } catch (err) {
    console.error(err);
  }
};

exports.onWordSubmitted = async (io, socket, trie, word, gameId) => {
  // 1. validate word
  const { valid, score } = validateWord(word.word, trie);
  // 2. get game object
  const game = await db.getGame(gameId, { joinRelation: false });
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
  const grid = generateBoardFrequencies();
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
      if (game.ended) {
        console.log("ending");
        db.getGame(gameId, {
          joinRelation: true,
          includeWordsPlayed: true
        })
          .then(game => {
            io.of("/game")
              .in(`${gameId}`)
              .emit("state", game);
          })
          .catch(e => console.error(e));
        return false; // exit callback loop
      } else {
        io.of("/game")
          .in(`${gameId}`)
          .emit("state", game);
        return true;
      }
    },
    1.0 * 1000
  );
};

exports.onNicknameChange = async (socket, nickname) => {
  const user = await db.getCurrentUser(socket);
  await db.updateUser(user.id, { nickname });
  socket.emit("nickname", nickname);
};

exports.onAuthentication = async (socket, token) => {
  try {
    const { userId } = await jwt.verify(token, process.env.APP_SECRET);
    await db.updateUser(userId, { socket_id: socket.id });
    console.log(`user ${userId} is now associated with socket ${socket.id}`);
    const userObj = await db.getUser(userId);
    socket.emit("nickname", userObj.nickname);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.onAuthenticateAnonymous = async socket => {
  try {
    const { id: userId } = await db.createUser({ socket_id: socket.id });
    const token = await jwt.sign({ userId }, process.env.APP_SECRET);
    socket.emit("token", token);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.onChatMessage = async (io, socket, message) => {
  const result = await db.createMessage({ message });
  const id = result.generated_keys[0];
  io.of("/chat").emit("chat message", { message, id });
};
