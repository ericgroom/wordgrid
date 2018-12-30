export const SET_TOKEN = "SET_TOKEN";
export const SENT_AUTH = "SENT_AUTH";
export const REQUEST_SET_NICKNAME = "REQUEST_SET_NICKNAME";
export const SET_NICKNAME = "SET_NICKNAME";
export const SET_USERID = "SET_USERID";
export const CONFIRM_AUTH = "CONFIRM_AUTH";

export const setNickname = nickname => ({
  type: REQUEST_SET_NICKNAME,
  nickname
});

export const setUserId = id => ({
  type: SET_USERID,
  id
});

export const confirmAuth = success => ({
  type: CONFIRM_AUTH,
  success
});
