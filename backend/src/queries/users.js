const User = require("../models/User");

/**
 * Create a new user
 *
 * @param {object=} user initial properties for user
 * @returns {User} user model instance;
 */
exports.createUser = async user => {
  try {
    return await User.query().insert(user);
  } catch (e) {
    throw e;
  }
};

/**
 * Updates a user via patch operation (not all fields required)
 *
 * @param {number} id database id of user
 * @param {object} user properties to update and values
 * @returns {User} user model instance
 */
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

/**
 * Retrieves a user
 *
 * @param {number} id database id of user
 * @returns {User} User model instance
 */
exports.getUser = async id => {
  try {
    return await User.query().findById(id);
  } catch (e) {
    throw e;
  }
};

/**
 * Gets an authenticated user based on socket.id
 *
 * @param {object} socket socket.io socket instance
 * @returns {User} User model instance
 */
exports.getCurrentUser = async socket => {
  try {
    return await User.query().findOne("socket_id", socket.id);
  } catch (e) {
    throw e;
  }
};

/**
 * Gets all games the user has joined which are still in-progress
 *
 * @param {User} user User model instance
 * @returns {Game[]} list of Game model instances
 */
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
