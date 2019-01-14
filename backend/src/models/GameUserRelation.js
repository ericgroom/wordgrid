const { Model } = require("objection");

class GameUserRelation extends Model {
  static get tableName() {
    return "game_user_relation";
  }
  static get idColumn() {
    return ["user_id", "game_id"];
  }
}

module.exports = GameUserRelation;
