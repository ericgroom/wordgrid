import userReducer from "../user";
import { setNickname, SET_NICKNAME, setUserId } from "../../actions/user";

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
