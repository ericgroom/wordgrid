import { CREATE_GAME } from "../actions";

const initialState = {
  id: null,
  created: false,
  started: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GAME:
      // make async call
      return { ...state, created: true };
    default:
      return state;
  }
};
