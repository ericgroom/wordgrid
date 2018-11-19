export const CREATE_GAME = "CREATE_GAME";
export const GAME_STATE_UPDATE = "GAME_STATE_UPDATE";
export const JOIN_GAME = "JOIN_GAME";
export const LEAVE_GAME = "LEAVE_GAME";

export const createGame = () => ({ type: CREATE_GAME });
export const joinGame = id => ({ type: JOIN_GAME, id });

export const updateGameState = payload => ({
  type: GAME_STATE_UPDATE,
  state: payload
});
