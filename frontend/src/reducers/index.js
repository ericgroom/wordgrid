import { combineReducers } from "redux";
import messages from "./messages";
import game from "./game";
import user from "./user";

export default combineReducers({
  messages,
  game,
  user
});
