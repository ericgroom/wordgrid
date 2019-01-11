import { messageListener } from "../messages";
import { receivedMessage } from "../../actions/messages";

jest.mock("../index.js", () => ({
  ...jest.requireActual("../index.js"),
  awaitAuthIfNeeded: function*() {
    console.log("awaiting auth");
  }
}));

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
