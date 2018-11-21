export const CREATE_GAME = "CREATE_GAME";
export const GAME_STATE_UPDATE = "GAME_STATE_UPDATE";
export const JOIN_GAME = "JOIN_GAME";
export const LEAVE_GAME = "LEAVE_GAME";
export const WORD_COMPLETED = "WORD_COMPLETED";
export const WORD_SENT = "WORD_SENT";
export const UPDATE_WORD = "UPDATE_WORD";
export const SET_NICKNAME = "SET_NICKNAME";
export const USER_JOIN = "USER_JOIN";

export const createGame = () => ({ type: CREATE_GAME });
export const joinGame = id => ({ type: JOIN_GAME, id });
export const updateWord = word => ({ type: UPDATE_WORD, word });
export const completeWord = word => ({ type: WORD_COMPLETED, word });
export const setNickname = nickname => ({ type: SET_NICKNAME, nickname });
export const userJoined = nickname => ({ type: USER_JOIN, nickname });
export const sentWord = word => ({ type: WORD_SENT, word });

export const updateGameState = payload => ({
  type: GAME_STATE_UPDATE,
  state: payload
});
