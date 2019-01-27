const { Model } = require("objection");

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    const Game = require("./Game");
    const Word = require("./Word");
    const Lobby = require("./Lobby");
    return {
      games: {
        relation: Model.ManyToManyRelation,
        modelClass: Game,
        join: {
          from: "users.id",
          through: {
            from: "game_user_relation.user_id",
            to: "game_user_relation.game_id",
            extra: ["score"]
          },
          to: "games.id"
        }
      },
      words: {
        relation: Model.HasManyRelation,
        modelClass: Word,
        join: {
          from: "users.id",
          to: "words.user_id"
        }
      },
      lobby: {
        relation: Model.BelongsToOneRelation,
        modelClass: Lobby,
        join: {
          from: "users.lobby_id",
          to: "lobbies.id"
        }
      }
    };
  }

  static get modifiers() {
    return {
      public: builder => builder.select(["id", "nickname", "is_anon", "score"]),
      scoreOrdered: builder => builder.orderBy("score", "DESC")
    };
  }
}

module.exports = User;
