import {
  setNickname,
  setUserId,
  SET_USERID,
  REQUEST_SET_NICKNAME
} from "../user";

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
