import { setNickname, setUserId, confirmAuth } from "../user";

describe("user action creators", () => {
  it("setNickname", () => {
    expect(setNickname("Eric")).toMatchSnapshot();
  });
  it("setUserId", () => {
    expect(setUserId(123)).toMatchSnapshot();
  });
  it("confirmAuth", () => {
    expect(confirmAuth(true)).toMatchSnapshot();
  });
});
