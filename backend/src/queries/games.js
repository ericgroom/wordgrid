const Game = require("../models/Game");
const Word = require("../models/Word");
const GameUserRelation = require("../models/GameUserRelation");
const { timedLoop } = require("../utils");

/**
 * Retrieves a game
 *
 * @param {number} id database id
 * @param {{joinRelation=true, includeWordsPlayed=false}} options
 *  joinRelation will retrieve all game relations,
 *  includeWordsPlayed will include words played by all users in response
 * @returns {Game} Game model instance
 */
exports.getGame = async (
  id,
  { joinRelation = true, includeWordsPlayed = false }
) => {
  try {
    if (joinRelation && includeWordsPlayed) {
      return await Game.query()
        .eager("[users(public, scoreOrdered).[words(scoreOrdered)]]")
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

/**
 * Continually retrieves Game instance and calls callback with the instance
 * until the callback returns false. If the game instance doesn't change between
 * calls the callback will not be called.
 *
 * @param {number} id database id for game
 * @param {function} callback callback which will be called repeatedly:
 *  will be passed game instance, callback should return a boolean indicating
 *  whether to run again
 * @param {number} timeout time delay between each iteration in ms
 */
exports.getGameChanges = async (id, callback, timeout) => {
  const getGame = async () =>
    await Game.query()
      .eager("[users(public, scoreOrdered)]")
      .findById(id);
  const callbackPredicate = (prev, next) =>
    JSON.stringify(prev) !== JSON.stringify(next);
  await timedLoop(getGame, callback, callbackPredicate, timeout);
};

/**
 * Creates a new game
 *
 * @param {object=} game initial properties of game
 * @returns {Game} Game model instance
 */
exports.createGame = async game => {
  try {
    return await Game.query().insert(game);
  } catch (e) {
    throw e;
  }
};

/**
 * Updates a game via patch operation
 *
 * @param {number} id database id of game
 * @param {object} game key-value object of properties to update
 */
exports.updateGame = async (id, game) => {
  try {
    return await Game.query()
      .findById(id)
      .patch(game);
  } catch (e) {
    throw e;
  }
};

/**
 * Recalculates the score of a user in a game
 *
 * @param {number} userId database id of user
 * @param {number} gameId database id of game
 */
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

/**
 * Joins a user to a game
 *
 * @param {number} userId database id of user
 * @param {number} gameId database id of game
 */
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

/**
 * Checks if a game has ended, if so, ends the game. If not,
 * returns the number of seconds remaining.
 *
 * @param {number} gameId database id of game
 * @param {object=} game pass Game model instance to prevent refetching
 * @returns {{ended: boolean, secondsRemaining: number}} ended status and seconds remaining
 */
exports.endGameIfNeeded = async (gameId, game) => {
  if (!game) {
    game = await Game.query().findById(gameId);
  }
  let ended = game.ended;
  const now = new Date();
  if (game.ended_at === null) {
    return { ended, secondsRemaining: null };
  }
  const secondsRemaining = Math.floor((game.ended_at - now) / 1000);
  if (secondsRemaining < 0 && !ended) {
    await exports.updateGame(gameId, { ended: true });
    ended = true;
  }
  return { ended, secondsRemaining };
};

/**
 * Add a word played by a user in a game
 *
 * @param {{word: string, valid: boolean, score: number, id: number}} word word played
 *  Note: `word.id` only is unique relative to the current user and game, not across all words played
 * @param {number} userId database id of user
 * @param {number} gameId database id of game
 */
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

/**
 * Retrieves the list of words played by a user in a game
 *
 * @param {number} userId database id of user
 * @param {number} gameId database id of game
 * @returns {Word[]} array of Word model instances
 */
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

/**
 * Starts a game
 *
 * @param {number} gameId database id of game to start
 * @param {number=60} duration duration of game
 * @returns {Game} Game model instance
 */
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
