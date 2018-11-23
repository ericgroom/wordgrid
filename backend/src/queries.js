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
    await conn.close();
  } catch (e) {
    throw e;
  }
};

exports.getGame = async id => {
  try {
    const conn = await connect();
    const game = await r
      .table(GAMES_TABLE)
      .get(id)
      .merge(game => ({
        users: game("users")
          .eqJoin("id", r.table(USERS_TABLE))
          .zip()
          .without("socket_id")
      }))
      .run(conn);
    await conn.close();
    return game;
  } catch (e) {
    throw e;
  }
};

exports.getGameChanges = async (
  id,
  callback,
  squash = true,
  includeInitial = true
) => {
  try {
    const conn = await connect();
    r.table(GAMES_TABLE)
      .get(id)
      .changes({ squash, includeInitial })("new_val")
      .merge(game => ({
        users: game("users")
          .eqJoin("id", r.table(USERS_TABLE))
          .zip()
          .without("socket_id")
      }))
      .run(conn, callback);
  } catch (e) {
    throw e;
  }
};

exports.createGame = async game => {
  try {
    const gameInit = {
      grid: [],
      users: [],
      started: false,
      ended: false,
      countdown: false
    };
    const conn = await connect();
    const gameObj = await r
      .table(GAMES_TABLE)
      .insert({ ...gameInit, ...game })
      .run(conn);
    await conn.close();
    return gameObj;
  } catch (e) {
    throw e;
  }
};

exports.updateGame = async (id, game) => {
  try {
    const conn = await connect();
    const gameObj = await r
      .table(GAMES_TABLE)
      .get(id)
      .update(game)
      .run(conn);
    await conn.close();
    return gameObj;
  } catch (e) {
    throw e;
  }
};

exports.gameQuery = async () => {
  const conn = await connect();
  return { conn, query: r.table(GAMES_TABLE) };
};

exports.createUser = async user => {
  try {
    const conn = await connect();
    const userObj = await r
      .table(USERS_TABLE)
      .insert(user)
      .run(conn);
    await conn.close();
    return userObj;
  } catch (e) {
    throw e;
  }
};

exports.updateUser = async (id, user) => {
  try {
    const conn = await connect();
    const userObj = await r
      .table(USERS_TABLE)
      .get(id)
      .update(user)
      .run(conn);
    await conn.close();
    return userObj;
  } catch (e) {
    throw e;
  }
};

exports.getUser = async id => {
  try {
    const conn = await connect();
    const user = await r
      .table(USERS_TABLE)
      .get(id)
      .run(conn);
    await conn.close();
    return user;
  } catch (e) {
    throw e;
  }
};

exports.getCurrentUser = async socket => {
  try {
    const conn = await connect();
    const cursor = await r
      .table(USERS_TABLE)
      .filter({ socket_id: socket.id })
      .run(conn);
    const user = await cursor.next();
    await cursor.close();
    await conn.close();
    return user;
  } catch (e) {
    throw e;
  }
};

exports.filterUsers = async filter => {
  try {
    const conn = await connect();
    const users = await r
      .table(USERS_TABLE)
      .filter(filter)
      .run(conn);
    await conn.close();
    return users;
  } catch (e) {
    throw e;
  }
};

exports.createMessage = async message => {
  try {
    const conn = await connect();
    const message = await r
      .table(MESSAGES_TABLE)
      .insert(message)
      .run(conn);
    await conn.close();
    return message;
  } catch (e) {
    throw e;
  }
};
