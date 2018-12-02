exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("games", table => {
      table.increments("id");
      table.timestamps(true, true);
      table.boolean("started").defaultTo(false);
      table.boolean("ended").defaultTo(false);
      table.boolean("countdown").defaultTo(false);
      table.string("grid");
    })
    .createTable("users", table => {
      table.increments("id");
      table.timestamps(true, true);
      table.string("socket_id");
      table.string("nickname");
      table.boolean("is_anon").defaultTo(true);
    })
    .createTable("game_user_relation", table => {
      table.integer("score").defaultTo(0);
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users");
      table
        .integer("game_id")
        .unsigned()
        .references("id")
        .inTable("games");
      table.primary(["user_id", "game_id"]);
    })
    .createTable("words", table => {
      table.integer("id");
      table
        .integer("game_id")
        .unsigned()
        .references("id")
        .inTable("games");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users");
      table.string("word");
      table.boolean("valid");
      table.integer("score");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists("game_user_relation")
    .dropTableIfExists("words")
    .dropTableIfExists("users")
    .dropTableIfExists("games");
};
