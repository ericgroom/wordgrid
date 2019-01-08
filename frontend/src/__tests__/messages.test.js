import messagesReducer from "../reducers/messages";
import { RECEIVED_MESSAGE, receivedMessage } from "../actions/messages";
import messagesSaga, { messageListener } from "../sagas/messages";
import { runSaga, stdChannel } from "redux-saga";

jest.mock("../sagas/index.js", () => ({
  ...jest.requireActual("../sagas/index.js"),
  awaitAuthIfNeeded: function*() {
    console.log("awaiting auth");
  }
}));

describe("messages actions", () => {
  it("receivedMessage", () => {
    const message = "hello";
    const action = receivedMessage(message);
    expect(action).toEqual({ type: RECEIVED_MESSAGE, message });
  });
});
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

function createMockSocket() {
  let handlers = {};
  let socket = {};
  socket.on = function(event, handler) {
    handlers[event] = handler;
  };
  socket.emit = function(event, ...args) {
    handlers[event](...args);
  };
  socket.handlers = handlers;
  return socket;
}

describe("messages saga", () => {
  let socket;
  let messageHandler;

  beforeEach(() => {
    socket = createMockSocket();
    messageHandler = jest.fn();
    socket.on("chat message", messageHandler);
  });
  it("listens for messages and puts appropriate action", async () => {
    const gen = messageListener(socket);
    const task = new Promise(resolve => gen.take(resolve));
    socket.emit("chat message", "hello");
    const helloAction = await task;
    expect(helloAction).toEqual(receivedMessage("hello"));
  });
  /**
   * Too difficult to test `take` effect for the moment. This is due to change
   * with the release of version 1.0 of `redux-saga`, will revisit when it releases.
   */
  it.skip("listens for actions and emits a socket event", async () => {
    let actionsDispatched = [];
    const task = await runSaga(
      {
        dispatch: action => actionsDispatched.push(action)
      },
      messagesSaga,
      socket
    );
    expect(task.isRunning()).toBe(true);
  });
});
