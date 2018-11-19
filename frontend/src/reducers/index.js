import { combineReducers } from "redux";
import grid from "./grid";
import messages from "./messages";
import game from "./game";

export default combineReducers({
  grid,
  messages,
  game
});
