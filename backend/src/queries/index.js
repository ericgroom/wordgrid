const Knex = require("knex");
const { Model } = require("objection");
const game = require("./game");
const users = require("./users");

function setupDB() {
  const knex = Knex(require("../../knexfile")[process.env.NODE_ENV]);
  Model.knex(knex);
}

module.exports = { game, users, setupDB };
