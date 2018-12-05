exports.up = function(knex, Promise) {
  return knex.schema.alterTable("games", table => {
    table.integer("duration").defaultTo(60);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("games", table => {
    table.dropColumn("duration");
  });
};
