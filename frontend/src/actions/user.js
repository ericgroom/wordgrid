export const SET_TOKEN = "SET_TOKEN";
export const SENT_AUTH = "SENT_AUTH";
export const REQUEST_SET_NICKNAME = "REQUEST_SET_NICKNAME";
export const SET_NICKNAME = "SET_NICKNAME";
export const SET_USERID = "SET_USERID";

export const setNickname = nickname => ({
  type: REQUEST_SET_NICKNAME,
  nickname
});

export const setUserId = id => ({
  type: SET_USERID,
  id
});
