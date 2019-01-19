import { combineReducers } from "redux";
import messages from "./messages";
import game, * as gameSelectors from "./game";
import user from "./user";

export default combineReducers({
  messages,
  game,
  user
});

export const getScoreOfCurrentUser = state =>
  gameSelectors.getScoreOfUser(state.game, state.user.userId);

export const getGameState = state => gameSelectors.getGameState(state.game);

export const getAllWordsPlayed = state => gameSelectors.getAllWords(state.game);
