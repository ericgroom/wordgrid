import { CREATE_GAME, GAME_STATE_UPDATE } from "../actions";

const initialState = {
  id: null,
  created: false,
  started: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GAME:
      return { ...state, created: true };
    case GAME_STATE_UPDATE:
      return { ...state, ...action.state };
    default:
      return state;
  }
};
