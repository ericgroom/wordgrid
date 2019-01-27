const { Model } = require("objection");

class Lobby extends Model {
  static get tableName() {
    return "lobbies";
  }

  static get relationMappings() {
    const Game = require("./Game");
    const User = require("./User");
    return {
      games: {
        relation: Model.HasManyRelation,
        modelClass: Game,
        join: {
          from: "lobbies.id",
          to: "games.lobby_id"
        }
      },
      currentGame: {
        relation: Model.HasOneRelation,
        modelClass: Game,
        join: {
          from: "lobbies.current_game",
          to: "games.lobby_id"
        }
      },
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: "lobbies.id",
          to: "users.lobby_id"
        }
      }
    };
  }
}

module.exports = Lobby;
