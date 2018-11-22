const r = require("rethinkdb");

const DB_NAME = "wordgrid";
const GAMES_TABLE = "games";
const USERS_TABLE = "users";

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
    await r
      .db(DB_NAME)
      .tableCreate(GAMES_TABLE)
      .run(conn)
      .then(() => {
        console.log("created table:", GAMES_TABLE);
      })
      .catch(() => {
        console.log("table already exists", GAMES_TABLE);
      });

    await r
      .db(DB_NAME)
      .tableCreate(USERS_TABLE)
      .run(conn)
      .then(() => {
        console.log("created table:", USERS_TABLE);
      })
      .catch(() => {
        console.log("table already exists", USERS_TABLE);
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
    const conn = await connect();
    return await r
      .table(GAMES_TABLE)
      .insert({})
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
