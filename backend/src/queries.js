const GAMES_TABLE = "games";
const USERS_TABLE = "users";
exports.getGame = async (knex, id) => {
  try {
    const game = await knex(GAMES_TABLE)
      .where("id", parseInt(id))
      .first()
      .select(["id", "grid"]);
    return game;
  } catch (e) {
    throw e;
  }
};

exports.createGame = async (knex, game) => {
  try {
    return await knex(GAMES_TABLE)
      .returning("id")
      .insert(game);
  } catch (e) {
    throw e;
  }
};

exports.createUserIfNotExists = async (
  knex,
  { where, select, insert, returning }
) => {
  try {
    const user = await knex(USERS_TABLE)
      .where(where)
      .first()
      .select(select);
    if (user) {
      return { created: false, data: user };
    } else {
      const user = await knex(USERS_TABLE)
        .insert(insert)
        .returning(returning);
      return { created: true, data: user };
    }
  } catch (e) {
    throw e;
  }
};

exports.createUser = async (knex, { insert, returning }) => {
  try {
    return await knex(USERS_TABLE)
      .returning(returning)
      .insert(insert);
  } catch (e) {
    throw e;
  }
};

exports.updateUser = async (knex, { where, update, returning }) => {
  try {
    return await knex(USERS_TABLE)
      .returning(returning)
      .where(where)
      .update(update);
  } catch (e) {
    throw e;
  }
};

exports.getUser = async (knex, { where, select }) => {
  try {
    return await knex(USERS_TABLE)
      .where(where)
      .select(select);
  } catch (e) {
    throw e;
  }
};
