export const REQUEST_CREATE_GAME = "REQUEST_CREATE_GAME";
export const GAME_CREATED = "GAME_CREATED";
export const GAME_STATE_UPDATE = "GAME_STATE_UPDATE";
export const JOIN_GAME = "JOIN_GAME";
export const LEAVE_GAME = "LEAVE_GAME";
export const WORD_COMPLETED = "WORD_COMPLETED";
export const WORD_SENT = "WORD_SENT";
export const UPDATE_WORD = "UPDATE_WORD";
export const REQUEST_SET_NICKNAME = "REQUEST_SET_NICKNAME";
export const SET_NICKNAME = "SET_NICKNAME";
export const USER_JOIN = "USER_JOIN";
export const REQUEST_START_GAME = "REQUEST_START_GAME";
export const START_GAME = "START_GAME";
export const END_GAME = "END_GAME";
export const START_COUNTDOWN = "START_COUNTDOWN";
export const SET_TOKEN = "SET_TOKEN";
export const SENT_AUTH = "SENT_AUTH";

export const createGame = () => ({ type: REQUEST_CREATE_GAME });
export const gameCreated = id => ({ type: GAME_CREATED, id });
export const joinGame = id => ({ type: JOIN_GAME, id });
export const updateWord = word => ({ type: UPDATE_WORD, word });
export const completeWord = word => ({ type: WORD_COMPLETED, word });
export const setNickname = nickname => ({
  type: REQUEST_SET_NICKNAME,
  nickname
});
export const userJoined = nickname => ({ type: USER_JOIN, nickname });
export const sentWord = word => ({ type: WORD_SENT, word });
export const startGame = () => ({ type: REQUEST_START_GAME });
export const startCountdown = duration => ({ type: START_COUNTDOWN, duration });
export const leaveGame = () => ({ type: LEAVE_GAME });
export const endGame = () => ({ type: END_GAME });

export const updateGameState = payload => ({
  type: GAME_STATE_UPDATE,
  state: payload
});
