const Knex = require("knex");
const { Model } = require("objection");
const games = require("./games");
const users = require("./users");

function setupDB() {
  const knex = Knex(require("../../knexfile")[process.env.NODE_ENV]);
  Model.knex(knex);
}

module.exports = { games, users, setupDB };
