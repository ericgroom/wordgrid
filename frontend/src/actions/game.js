export const CREATE_GAME = "CREATE_GAME";
export const GAME_STATE_UPDATE = "GAME_STATE_UPDATE";

export const createGame = () => ({ type: CREATE_GAME });

export const updateGameState = payload => ({
  type: GAME_STATE_UPDATE,
  state: payload
});
