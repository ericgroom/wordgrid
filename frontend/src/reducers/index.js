import { combineReducers } from "redux";
import grid from "./grid";
import messages from "./messages";

export default combineReducers({
  grid,
  messages
});
