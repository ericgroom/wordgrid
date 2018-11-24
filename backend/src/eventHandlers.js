const r = require("rethinkdb");
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
    if (game) {
      socket.emit("state", game);
    } else {
      socket.emit("not exists");
    }
    // TODO leave room
    socket.join(`${gameId}`);
    const { id: userId, nickname } = await db.getCurrentUser(socket);
    // add user to game unless they have already been added or the game has ended
    await db.updateGame(gameId, game => ({
      users: r.branch(
        game("ended")
          .eq(true)
          .or(game("users").contains(user => user("id").eq(userId))),
        game("users"),
        game("users").append({ id: userId, words: [], score: 0 })
      )
    }));
    const gameState = await db.getGame(gameId);
    const strippedGameState = gameState.ended
      ? gameState
      : stripWordsFromGame(gameState);
    io.of("/game")
      .to(`${gameId}`)
      .emit("state", strippedGameState);
  } catch (err) {
    console.error(err);
  }
};

exports.onWordSubmitted = async (io, socket, trie, word, gameId) => {
  // 1. validate word
  const { valid, score } = validateWord(word.word, trie);
  // 2. get game object
  const game = await db.getGame(gameId);
  // 3. ensure game is still active
  if (game.ended) return;
  // 4. add word to list of words played, update scores
  const { id: userId } = await db.getCurrentUser(socket);
  console.log("before");
  const wUpdate = await db.updateGame(gameId, game => {
    return {
      users: game("users").map(user => {
        return r.branch(
          user("id").eq(userId), // if matches id
          user.merge({
            // merge updates into existing row
            words: user("words").append({ ...word, score, valid }),
            score: user("score").add(score)
          }),
          user // else return unmodified row
        );
      })
    };
  });
  // 5. send word back to sender
  socket.emit("word", { valid, id: word.id, score });
};

exports.onGameStart = async (io, socket, gameId) => {
  const grid = generateBoard();
  await db.updateGame(gameId, { grid, countdown: true, started: true });
  const game = await db.getGame(gameId);
  const now = new Date();
  const gameWithStart = { ...game, startTime: now };
  socket.emit("start game", gameWithStart);
  await db.updateGame(gameId, gameWithStart);
  // timeout to end the game
  setTimeout(async () => {
    console.log(`ending game: ${gameId}`);
    await db.updateGame(gameId, { ended: true });
  }, 20 * 1000);
  await db.getGameChanges(
    gameId,
    (err, cursor) => {
      if (err) console.error(err);
      console.log("cursor created");
      cursor.each((err, row) => {
        if (err) console.error(err);
        const newState = stripWordsFromGame(row);
        io.of("/game")
          .in(`${gameId}`)
          .emit("state", newState);
        console.log("emitted state");
        if (newState.ended) {
          io.of("/game")
            .in(`${gameId}`)
            .emit("state", row);
          console.log(`closing cursor for game changes: ${gameId}`);
          cursor.close();
          return false; // exit cursor.each
        }
      });
      console.log("next iteration");
    },
    1.0
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
