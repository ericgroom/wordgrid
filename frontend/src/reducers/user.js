import {
  SET_NICKNAME,
  REQUEST_SET_NICKNAME,
  SET_USERID,
  CONFIRM_AUTH
} from "../actions";
const initialState = {
  nickname: null,
  nicknameRequested: false,
  userId: null,
  authConfirmed: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NICKNAME:
      return { ...state, nickname: action.nickname, nicknameRequested: false };
    case REQUEST_SET_NICKNAME:
      return { ...state, nicknameRequested: true };
    case SET_USERID:
      return { ...state, userId: action.id };
    case CONFIRM_AUTH:
      return { ...state, authConfirmed: true };
    default:
      return state;
  }
};
