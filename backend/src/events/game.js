const utils = require("./utils");
const emitters = require("../emitters");
const wordUtils = require("../words");
const board = require("../board");
const db = require("../queries/game");
const { decodeId } = require("../utils");

exports.onGameJoin = async (io, socket, gameId) => {
  try {
    // 1. check if game exists
    const game = await db.getGame(gameId, { joinRelation: false });
    if (!game) {
      emitters.game.gameNotExists(socket);
      return;
    }
    socket.join(`${gameId}`);
    const user = await utils.getCurrentUser(socket, gameId);
    if (!user) {
      console.log(`cannot find user for socket id ${socket.id}`);
      return;
    }
    const { id: userId } = user;
    // 2. check if game is ended
    const { ended, secondsRemaining } = await db.endGameIfNeeded(gameId);
    // 3. join game if not ended
    if (!ended) {
      try {
        // TODO actually check if user is already in game to prevent false positives
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
    emitters.game.stateUpdate(io, gameId, gameState);
    // 5. send remaining time
    if (secondsRemaining) {
      emitters.game.timeRemaining(socket, secondsRemaining);
    }
    // 6. Send list of words already played
    const words = await db.getWordsPlayed(userId, gameId);
    if (words && words.length > 0) {
      emitters.game.wordsPlayed(socket, words);
    }
  } catch (err) {
    console.error(err);
  }
};

exports.onWordSubmitted = async (socket, trie, word, gameId) => {
  const game = await db.getGame(gameId, { joinRelation: false });
  if (game.ended) return;
  const isValid = wordUtils.validateWordAndPath(
    word.word,
    word.path,
    game.grid,
    trie
  );
  const score = isValid ? wordUtils.scoreWord(word.word) : 0;
  // 5. add word to list of words played, update scores
  const { id: userId } = await utils.getCurrentUser(socket, gameId);
  console.log(
    `user ${userId} plays "${word.word}" in ${gameId} which valid = ${isValid}`
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
  emitters.game.updateWord(socket, { valid: isValid, id: word.id, score });
};

exports.startCountdown = async (io, gameId) => {
  await db.updateGame(gameId, { countdown: true });
  const countdownDuration = 3;
  emitters.game.startCountdown(io, gameId, countdownDuration);
  return countdownDuration;
};

exports.onGameStart = async (io, gameId) => {
  const grid = board.generateBoard();
  await db.updateGame(gameId, { grid: grid.join(""), started: true });
  const gameWithStart = await db.startGame(gameId);
  emitters.game.stateUpdate(io, gameId, gameWithStart);
  const { duration = 60 } = gameWithStart;
  // timeout to end the game
  setTimeout(async () => {
    console.log(`ending game: ${gameId}`);
    await db.updateGame(gameId, { ended: true });
    emitters.game.endGame(io, gameId);
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
            emitters.game.stateUpdate(io, gameId, game);
          })
          .catch(e => console.error(e));
        return false; // exit callback loop
      } else {
        emitters.game.stateUpdate(io, gameId, game);
        return true;
      }
    },
    1.0 * 1000
  );
};

exports.registerListeners = (io, socket, trie) => {
  socket.on("join game", async ({ id }) => {
    id = decodeId(id);
    console.log(`${socket.id} joins game: ${id}`);
    await exports.onGameJoin(io, socket, id);
  });
  socket.on("word", async ({ word, id: wordId, path }, gameId) => {
    gameId = decodeId(gameId);
    console.log(`${socket.id} plays word: ${word} in game: ${gameId}`);
    await exports.onWordSubmitted(
      socket,
      trie,
      { word, id: wordId, path },
      gameId
    );
  });
  socket.on("game start", async ({ id }) => {
    id = decodeId(id);
    const countdown = await exports.startCountdown(io, id);
    setTimeout(async () => {
      console.log(`${socket.id} starts game: ${id}`);
      await exports.onGameStart(io, id);
    }, countdown * 1000);
  });

  socket.on("leave game", gameId => {
    gameId = decodeId(gameId);
    console.log(`socket ${socket.id} leaves game: ${gameId}`);
    socket.leave(gameId);
  });
};
