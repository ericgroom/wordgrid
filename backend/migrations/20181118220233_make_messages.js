exports.up = function(knex, Promise) {
  return knex.schema.createTable("messages", table => {
    table.increments("id");
    table.string("message");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("messages");
};
