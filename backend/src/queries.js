const Knex = require("knex");
const { Model } = require("objection");
const Game = require("../models/Game");
const User = require("../models/User");
const Word = require("../models/Word");
const GameUserRelation = require("../models/GameUserRelation");
const { timedLoop } = require("./utils");

const DB_NAME = "wordgrid";
const GAMES_TABLE = "games";
const USERS_TABLE = "users";
const TABLES = [GAMES_TABLE, USERS_TABLE];

const knex = Knex(require("../knexfile.js")[process.env.NODE_ENV]);
Model.knex(knex);

exports.getGame = async (
  id,
  { joinRelation = true, includeWordsPlayed = false }
) => {
  try {
    if (joinRelation && includeWordsPlayed) {
      return await Game.query()
        .eager("[users(public, scoreOrdered).[words]]")
        .modifyEager("users.words", builder => builder.where("game_id", id))
        .findById(id);
    } else if (joinRelation && !includeWordsPlayed) {
      return await Game.query()
        .eager("[users(public, scoreOrdered)]")
        .findById(id);
    } else {
      return await Game.query().findById(id);
    }
  } catch (e) {
    throw e;
  }
};

exports.getGameChanges = async (id, callback, timeout) => {
  const getGame = async () =>
    await Game.query()
      .eager("[users(public, scoreOrdered)]")
      .findById(id);
  const callbackPredicate = (prev, next) =>
    JSON.stringify(prev) !== JSON.stringify(next);
  await timedLoop(getGame, callback, callbackPredicate, timeout);
};

exports.createGame = async game => {
  try {
    const gameObj = await Game.query().insert(game);
    console.log(`new game ${gameObj.id}`);
    return gameObj;
  } catch (e) {
    throw e;
  }
};

exports.updateGame = async (id, game) => {
  try {
    return await Game.query()
      .findById(id)
      .patch(game);
  } catch (e) {
    throw e;
  }
};

exports.updateScore = async (userId, gameId) => {
  try {
    const sum = await Word.query()
      .where({
        user_id: userId,
        game_id: gameId
      })
      .sum("score")
      .first();
    const score = parseInt(sum.sum);
    await GameUserRelation.query()
      .findById([userId, gameId])
      .patch({ score });
  } catch (e) {
    throw e;
  }
};

exports.joinGame = async (userId, gameId) => {
  try {
    return await GameUserRelation.query().insert({
      user_id: userId,
      game_id: gameId
    });
  } catch (e) {
    throw e;
  }
};

exports.addWord = async (word, userId, gameId) => {
  try {
    return await Word.query().insert({
      word: word.word,
      id: word.id,
      valid: word.valid,
      score: word.score,
      user_id: userId,
      game_id: gameId
    });
  } catch (e) {
    throw e;
  }
};

exports.getWordsPlayed = async (userId, gameId) => {
  try {
    return await Word.query()
      .where({ game_id: gameId, user_id: userId })
      .select("id", "score", "word", "valid")
      .orderBy("id", "ASC");
  } catch (e) {
    throw e;
  }
};

exports.startGame = async (gameId, duration = 60) => {
  // TODO consider adding start and end timestamps
  const startTime = new Date();
  const endTime = (() => {
    let t = new Date(startTime.getTime());
    t.setSeconds(t.getSeconds() + duration);
    console.log("t", t);
    return t;
  })();
  console.log(startTime, endTime);
  return await Game.query()
    .findById(gameId)
    .returning("*")
    .patch({
      started: true,
      started_at: startTime,
      ended_at: endTime,
      duration
    });
};

// exports.gameQuery = async () => {
//   const conn = await connect();
//   return { conn, query: r.table(GAMES_TABLE) };
// };

exports.createUser = async user => {
  try {
    return await User.query().insert(user);
  } catch (e) {
    throw e;
  }
};

exports.updateUser = async (id, user) => {
  try {
    return await User.query()
      .findById(id)
      .returning("*")
      .patch(user);
  } catch (e) {
    throw e;
  }
};

exports.getUser = async id => {
  try {
    return await User.query().findById(id);
  } catch (e) {
    throw e;
  }
};

exports.getCurrentUser = async socket => {
  try {
    return await User.query().findOne("socket_id", socket.id);
  } catch (e) {
    throw e;
  }
};

exports.getActiveGamesForUser = async user => {
  try {
    return await user.$relatedQuery("games").where({
      ended: false,
      started: true
    });
  } catch (e) {
    throw e;
  }
};
