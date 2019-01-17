export const REQUEST_CREATE_GAME = "REQUEST_CREATE_GAME";
export const GAME_CREATED = "GAME_CREATED";
export const GAME_STATE_UPDATE = "GAME_STATE_UPDATE";
export const JOIN_GAME = "JOIN_GAME";
export const LEAVE_GAME = "LEAVE_GAME";
/**
 * Used by saga, since sagas run after reducers, and reducers
 * can't emit additional actions, it is difficult to both check
 * if a word has been sent to the backend and update state, so the
 * saga handles everything and then emits `ADD_WORD`
 */
export const WORD_COMPLETED = "WORD_COMPLETED";
export const UPDATE_WORD = "UPDATE_WORD";
export const REQUEST_START_GAME = "REQUEST_START_GAME";
export const START_GAME = "START_GAME";
export const END_GAME = "END_GAME";
export const START_COUNTDOWN = "START_COUNTDOWN";
export const REJOINED = "REJOINED";
export const ADD_WORD = "ADD_WORD";

export const createGame = () => ({ type: REQUEST_CREATE_GAME });
export const gameCreated = id => ({ type: GAME_CREATED, id });
export const joinGame = id => ({ type: JOIN_GAME, id });
export const addWord = word => ({ type: ADD_WORD, word });
export const updateWord = word => ({ type: UPDATE_WORD, word });
export const completeWord = word => ({ type: WORD_COMPLETED, word });

export const startGame = () => ({ type: REQUEST_START_GAME });
export const startCountdown = duration => ({ type: START_COUNTDOWN, duration });
export const leaveGame = id => ({ type: LEAVE_GAME, id });
export const endGame = () => ({ type: END_GAME });
export const rejoined = durationRemaining => ({
  type: REJOINED,
  durationRemaining
});

export const updateGameState = payload => ({
  type: GAME_STATE_UPDATE,
  state: payload
});
