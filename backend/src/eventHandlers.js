const jwt = require("jsonwebtoken");
const _ = require("lodash");
const db = require("./queries");
const { generateBoardFrequencies } = require("./utils");
const { validateWord, validatePath } = require("./words");

exports.onGameJoin = async (io, socket, gameId) => {
  try {
    // 1. check if game exists
    const game = await db.getGame(gameId, { joinRelation: false });
    if (!game) {
      socket.emit("not exists");
    }
    socket.join(`${gameId}`);
    const user = await exports.getCurrentUser(socket, gameId);
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
    const gameState = ended
      ? await db.getGame(gameId, {
          includeWordsPlayed: true
        })
      : await db.getGame(gameId, {});
    io.of("/game")
      .to(`${gameId}`)
      .emit("state", gameState);
    // 5. send remaining time
    if (secondsRemaining) {
      socket.emit("remaining time", secondsRemaining);
    }
    // 6. Send list of words already played
    const words = await db.getWordsPlayed(userId, gameId);
    if (words && words.length > 0) {
      socket.emit("played words", words);
    }
  } catch (err) {
    console.error(err);
  }
};

exports.onWordSubmitted = async (io, socket, trie, word, gameId) => {
  // 1. validate word
  const { valid: validWord, score } = validateWord(word.word, trie);
  // 2. get game object
  const game = await db.getGame(gameId, { joinRelation: false });
  // 3. ensure game is still active
  if (game.ended) return;
  // 4. validate path
  const validPath = (function() {
    // if the word is invalid there is no point in validating the path which is more expensive
    if (!validWord) return false;
    const isValidPath = validatePath(word.word, word.path, game.grid);
    return isValidPath;
  })();
  const isValid = validWord && validPath;
  // 5. add word to list of words played, update scores
  const { id: userId } = await exports.getCurrentUser(socket, gameId);
  console.log(
    `user ${userId} plays "${
      word.word
    }" in ${gameId} which valid = ${isValid} (path ${validPath} word ${validWord})`
  );
  if (isValid) {
    const validWordObject = {
      word: word.word,
      valid: isValid,
      score,
      id: word.id
    };
    await db.addWord(validWordObject, userId, gameId);
    await db.updateScore(userId, gameId);
  }
  // 6. send word back to sender
  socket.emit("word", { valid: isValid, id: word.id, score });
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
  const user = await exports.getCurrentUser(socket);
  await db.updateUser(user.id, { nickname });
  socket.emit("nickname", nickname);
};

exports.onAuthentication = async (socket, token) => {
  try {
    const { userId } = await jwt.verify(token, process.env.APP_SECRET);
    await db.updateUser(userId, { socket_id: socket.id });
    console.log(`user ${userId} is now associated with socket ${socket.id}`);
    const { nickname } = await db.getUser(userId);
    socket.emit("nickname", nickname);
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

exports.onChatMessage = async (io, socket, message, gameId) => {
  const { nickname } = await exports.getCurrentUser(socket, gameId);
  if (nickname) {
    io.of("/game")
      .in(`${gameId}`)
      .emit("chat message", { message, sender: nickname });
  }
};

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
 * @param {Number} rejoinGameId gameId to rejoin socket if disconnected
 */
exports.getCurrentUser = async (socket, rejoinGameId) => {
  const user = await db.getCurrentUser(socket);
  if (!user) {
    const token = await (async function() {
      return new Promise((resolve, reject) => {
        socket.emit("give token", token => {
          resolve(token);
        });
      });
    })();
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
