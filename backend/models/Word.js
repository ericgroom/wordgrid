const { Model } = require("objection");

class Word extends Model {
  static get tableName() {
    return "words";
  }

  static get relationMappings() {
    const Game = require("./Game");
    const User = require("./User");

    return {
      game: {
        relation: Model.BelongsToOneRelation,
        modelClass: Game,
        join: {
          from: "words.game_id",
          to: "games.id"
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "words.user_id",
          to: "users.id"
        }
      }
    };
  }
}

module.exports = Word;
