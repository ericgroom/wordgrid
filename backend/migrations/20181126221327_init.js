exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("games", table => {
      table.increments("id");
      table.timestamps();
      table.boolean("started").defaultTo(false);
      table.boolean("ended").defaultTo(false);
      table.boolean("countdown").defaultTo(false);
    })
    .createTable("users", table => {
      table.increments("id");
      table.timestamps();
      table.string("socket_id");
      table.boolean("is_anon").defaultTo(true);
    })
    .createTable("game_user_relation", table => {
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
    })
    .createTable("words", table => {
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
    .dropTableIfExists("users")
    .dropTableIfExists("words")
    .dropTableIfExists("games");
};
