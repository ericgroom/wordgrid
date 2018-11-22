const r = require("rethinkdb");

const DB_NAME = "wordgrid";
const GAMES_TABLE = "games";
const USERS_TABLE = "users";
const MESSAGES_TABLE = "messages";
const TABLES = [GAMES_TABLE, MESSAGES_TABLE, USERS_TABLE];

const connect = async () => {
  return await r.connect({ db: DB_NAME });
};

exports.setup = async () => {
  try {
    const conn = await r.connect();
    await r
      .dbCreate(DB_NAME)
      .run(conn)
      .then(() => {
        console.log("database successfully created");
      })
      .catch(() => console.log("database already exists"));
    await TABLES.forEach(async table => {
      await r
        .db(DB_NAME)
        .tableCreate(table)
        .run(conn)
        .then(() => {
          console.log("created table:", table);
        })
        .catch(() => {
          console.log("table already exists", table);
        });
    });
  } catch (e) {
    throw e;
  }
};

exports.getGame = async id => {
  try {
    const conn = await connect();
    return await r
      .table(GAMES_TABLE)
      .get(id)
      .run(conn);
  } catch (e) {
    throw e;
  }
};

exports.createGame = async game => {
  try {
    const gameInit = {
      board: [],
      users: [],
      started: false,
      countdown: false,
      scores: {},
      words_by_user: {}
    };
    const conn = await connect();
    return await r
      .table(GAMES_TABLE)
      .insert({ ...gameInit, ...game })
      .run(conn);
  } catch (e) {
    throw e;
  }
};

exports.updateGame = async (id, game) => {
  try {
    const conn = await connection();
    return await r
      .table(GAMES_TABLE)
      .get(id)
      .update(game)
      .run(conn);
  } catch (e) {
    throw e;
  }
};

// exports.createUserIfNotExists = async (
//   knex,
//   { where, select, insert, returning }
// ) => {
//   try {
//     const user = await knex(USERS_TABLE)
//       .where(where)
//       .first()
//       .select(select);
//     if (user) {
//       return { created: false, data: user };
//     } else {
//       const user = await knex(USERS_TABLE)
//         .insert(insert)
//         .returning(returning);
//       return { created: true, data: user };
//     }
//   } catch (e) {
//     throw e;
//   }
// };

exports.createUser = async user => {
  try {
    const conn = await connect();
    return await r
      .table(USERS_TABLE)
      .insert(user)
      .run(conn);
  } catch (e) {
    throw e;
  }
};

exports.updateUser = async (id, user) => {
  try {
    const conn = await connect();
    return await r
      .table(USERS_TABLE)
      .get(id)
      .update(user)
      .run(conn);
  } catch (e) {
    throw e;
  }
};

exports.getUser = async id => {
  try {
    const conn = await connect();
    return await r
      .table(USERS_TABLE)
      .get(id)
      .run(conn);
  } catch (e) {
    throw e;
  }
};

exports.filterUsers = async filter => {
  try {
    const conn = await connect();
    return await r
      .table(USERS_TABLE)
      .filter(filter)
      .run(conn);
  } catch (e) {
    throw e;
  }
};

exports.createMessage = async message => {
  try {
    const conn = await connect();
    return await r
      .table(MESSAGES_TABLE)
      .insert(message)
      .run(conn);
  } catch (e) {
    throw e;
  }
};
