const { Model } = require("objection");

class Game extends Model {
  static get tableName() {
    return "games";
  }

  static get relationMappings() {
    const User = require("./User");
    const Word = require("./Word");
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "games.id",
          through: {
            from: "game_user_relation.game_id",
            to: "game_user_relation.user_id",
            extra: ["score"]
          },
          to: "users.id"
        }
      },
      words: {
        relation: Model.HasManyRelation,
        modelClass: Word,
        join: {
          from: "games.id",
          to: "words.game_id"
        }
      }
    };
  }
}

module.exports = Game;
