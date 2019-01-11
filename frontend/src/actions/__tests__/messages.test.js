import { receivedMessage, RECEIVED_MESSAGE } from "../messages";

describe("messages actions", () => {
  it("receivedMessage", () => {
    const message = "hello";
    const action = receivedMessage(message);
    expect(action).toEqual({ type: RECEIVED_MESSAGE, message });
  });
});
