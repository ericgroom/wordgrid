const { Model } = require("objection");

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    const Game = require("./Game");
    return {
      games: {
        relation: Model.ManyToManyRelation,
        modelClass: Game,
        join: {
          from: "users.id",
          through: {
            from: "game_user_relation.user_id",
            to: "game_user_relation.game_id"
          },
          to: "games.id"
        }
      }
    };
  }
}

module.exports = User;
