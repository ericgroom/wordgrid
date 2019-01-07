import userReducer from "../reducers/user";
import {
  setNickname,
  SET_NICKNAME,
  REQUEST_SET_NICKNAME,
  setUserId,
  SET_USERID
} from "../actions/user";

describe("user action creators", () => {
  it("setNickname", () => {
    const nickname = "Eric";
    const action = setNickname(nickname);
    expect(action).toEqual({ type: REQUEST_SET_NICKNAME, nickname });
  });
  it("setUserId", () => {
    const userId = 123;
    const action = setUserId(userId);
    expect(action).toEqual({ type: SET_USERID, id: userId });
  });
});

describe("user reducer", () => {
  const initialState = userReducer(undefined, {});
  it("creates expected initial state", () => {
    expect(initialState).toEqual({
      nickname: null,
      nicknameRequested: false,
      userId: null,
      authConfirmed: false
    });
  });
  it("updates nickname state properly", () => {
    const afterRequest = userReducer(initialState, setNickname("nick"));
    expect(afterRequest.nickname).toBe(null);
    expect(afterRequest.nicknameRequested).toBe(true);
    const updatedState = userReducer(afterRequest, {
      type: SET_NICKNAME,
      nickname: "test"
    });
    expect(updatedState.nickname).toBe("test");
    expect(updatedState.nicknameRequested).toBe(false);
  });
  it("updates userId correctly", () => {
    const updatedState = userReducer(initialState, setUserId(123));
    expect(updatedState.userId).toBe(123);
  });
});
