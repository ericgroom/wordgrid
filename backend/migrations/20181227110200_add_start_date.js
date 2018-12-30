exports.up = function(knex, Promise) {
  return knex.schema.alterTable("games", table => {
    table.datetime("started_at");
    table.datetime("ended_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("games", table => {
    table.dropColumn("started_at");
    table.dropColumn("ended_at");
  });
};
