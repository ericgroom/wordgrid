import {
  CREATE_GAME,
  GAME_STATE_UPDATE,
  JOIN_GAME,
  LEAVE_GAME
} from "../actions";

const initialState = {
  id: null,
  created: false,
  started: false,
  joined: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GAME:
      return { ...state, created: true };
    case GAME_STATE_UPDATE:
      return { ...state, ...action.state };
    case JOIN_GAME:
      return { ...state, id: action.id, joined: true };
    case LEAVE_GAME:
      return initialState;
    default:
      return state;
  }
};
