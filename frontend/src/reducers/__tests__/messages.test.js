import messagesReducer from "../messages";
import { receivedMessage } from "../../actions/messages";

describe("messages reducer", () => {
  it("updates state when message is received", () => {
    const initialState = messagesReducer(undefined, {});
    expect(initialState.messages.length).toBe(0);
    expect(initialState.messageId).toBe(0);

    const message = { message: "a new message", sender: "eric" };
    const newState = messagesReducer(initialState, receivedMessage(message));
    expect(newState.messages.length).toBe(1);
    expect(newState.messageId).toBe(1);
    expect(newState.messages[0]).toEqual({ ...message, id: 0 });
  });
});
