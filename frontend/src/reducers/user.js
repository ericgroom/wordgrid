import { SET_NICKNAME, REQUEST_SET_NICKNAME } from "../actions";
const initialState = {
  nickname: null,
  nicknameRequested: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NICKNAME:
      return { ...state, nickname: action.nickname };
    case REQUEST_SET_NICKNAME:
      return { ...state, nicknameRequested: true };
    default:
      return state;
  }
};
