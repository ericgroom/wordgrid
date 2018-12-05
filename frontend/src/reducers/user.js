import { SET_NICKNAME, REQUEST_SET_NICKNAME, SET_USERID } from "../actions";
const initialState = {
  nickname: null,
  nicknameRequested: false,
  userId: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NICKNAME:
      return { ...state, nickname: action.nickname };
    case REQUEST_SET_NICKNAME:
      return { ...state, nicknameRequested: true };
    case SET_USERID:
      return { ...state, userId: action.id };
    default:
      return state;
  }
};
