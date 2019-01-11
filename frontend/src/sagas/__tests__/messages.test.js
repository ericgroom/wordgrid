import SagaTester from "redux-saga-tester";
import rootReducer from "../../reducers";
import { SEND_MESSAGE } from "../../actions/messages";
import { messageListener, messageActionListener } from "../messages";
import { receivedMessage } from "../../actions/messages";
import { joinGame } from "../../actions";

jest.mock("../index.js", () => ({
  ...jest.requireActual("../index.js"),
  awaitAuthIfNeeded: function*() {
    console.log("awaiting auth");
  }
}));

describe("messages saga", () => {
  let socket;
  let messageHandler;
  let sagaTester;

  beforeEach(() => {
    socket = createMockSocket();
    messageHandler = jest.fn();
    socket.on("chat message", messageHandler);
    sagaTester = new SagaTester({
      reducers: rootReducer
    });
  });
  it("listens for messages and puts appropriate action", async () => {
    const gen = messageListener(socket);
    const task = new Promise(resolve => gen.take(resolve));
    socket.emit("chat message", "hello");
    const helloAction = await task;
    expect(helloAction).toEqual(receivedMessage("hello"));
  });
  it("listens for actions and emits a socket event", async () => {
    let actionsDispatched = [];
    sagaTester.start(messageActionListener, socket);
    expect(sagaTester.getState()).toEqual(rootReducer(undefined, {}));
    sagaTester.dispatch(joinGame(12));
    expect(sagaTester.getState().game.id).toBe(12);
    sagaTester.dispatch({ type: SEND_MESSAGE, message: "hello!" });
    expect(messageHandler.mock.calls.length).toBe(1);
    expect(messageHandler.mock.calls[0][0]).toEqual({
      message: "hello!",
      gameId: 12
    });
  });
});
