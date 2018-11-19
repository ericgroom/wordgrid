exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("games", table => {
      table.increments("id");
      table.string("grid");
      table.timestamps(true, true);
    }),

    knex.schema.createTable("users", table => {
      table.increments("id");
      table.uuid("session_id");
      table.string("nickname", 30);
      table.timestamps(true, true);
    }),

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
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("games"),
    knex.schema.dropTable("users"),
    knex.schema.dropTable("game_to_user")
  ]);
};
