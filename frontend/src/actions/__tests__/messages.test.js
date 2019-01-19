import { receivedMessage, RECEIVED_MESSAGE } from "../messages";

describe("messages actions", () => {
  it("receivedMessage", () => {
    expect(receivedMessage("hello")).toMatchSnapshot();
  });
});
