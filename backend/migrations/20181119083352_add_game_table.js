exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("games", table => {
      table.increments("id");
      table.timestamps(true, true);
    })
    .then(() => {
      knex.schema.createTable("users", table => {
        table.increments("id");
        table.uuid("session_id");
        table.string("nickname", 30);
        table.timestamps(true, true);
      });
    })
    .then(() => {
      knex.schema.createTable("game_to_user", table => {
        table
          .integer("game")
          .unsigned()
          .notNullable();
        table
          .integer("user")
          .unsigned()
          .notNullable();
        table
          .foreign("game")
          .references("id")
          .inTable("games");
        table
          .foreign("user")
          .references("id")
          .inTable("users");
      });
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable("games")
    .then(() => knex.schema.dropTable("users"))
    .then(() => knex.schema.dropTable("game_to_user"));
};
