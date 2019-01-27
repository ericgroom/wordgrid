exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("lobbies", table => {
      table.increments("id");
      table
        .integer("current_game")
        .unsigned()
        .references("id")
        .inTable("games");
      table.timestamps(true, true);
    })
    .alterTable("games", table => {
      table
        .integer("lobby_id")
        .unsigned()
        .references("id")
        .inTable("lobbies");
    })
    .alterTable("users", table => {
      table
        .integer("lobby_id")
        .unsigned()
        .references("id")
        .inTable("lobbies");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .alterTable("games", table => {
      table.dropColumn("lobby_id");
    })
    .alterTable("users", table => {
      table.dropColumn("lobby_id");
    })
    .dropTableIfExists("lobbies");
};
