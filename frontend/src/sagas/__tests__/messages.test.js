import SagaTester from "redux-saga-tester";
import rootReducer from "../../reducers";
import { SEND_MESSAGE } from "../../actions/messages";
import messagesSaga, {
  messageListener,
  messageActionListener
} from "../messages";
import { receivedMessage } from "../../actions/messages";
import { joinGame, confirmAuth } from "../../actions";

describe("messageActionListener", () => {
  let socket;
  let messageHandler;
  let sagaTester;

  beforeEach(() => {
    socket = createMockSocket();
    messageHandler = jest.fn();
    socket.on("send chat message", messageHandler);
    sagaTester = new SagaTester({
      reducers: rootReducer
    });
  });

  it("listens for actions and emits a socket event", async () => {
    sagaTester.start(messageActionListener, socket);
    expect(sagaTester.getState()).toEqual(rootReducer(undefined, {}));
    sagaTester.dispatch(confirmAuth(true));
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

describe("messageListener", () => {
  let socket;
  beforeEach(() => {
    socket = createMockSocket();
  });
  it("listens for messages and puts appropriate action", async () => {
    const gen = messageListener(socket);
    const task = new Promise(resolve => gen.take(resolve));
    socket.emit("chat message", "hello");
    const helloAction = await task;
    expect(helloAction).toEqual(receivedMessage("hello"));
  });
});
describe("messages saga", () => {
  let socket;
  let sagaTester;
  beforeEach(() => {
    socket = createMockSocket();
    sagaTester = new SagaTester({ reducers: rootReducer });
  });
  it("listens for messages from socket", () => {
    sagaTester.start(messagesSaga, socket);
    expect(sagaTester.getState()).toEqual(rootReducer(undefined, {}));
    sagaTester.dispatch(confirmAuth(true));
    sagaTester.dispatch(joinGame(12));
    const message = { sender: "nickname", message: "Hello" };
    socket.emit("chat message", message);
    expect(sagaTester.getLatestCalledAction()).toEqual(
      receivedMessage(message)
    );
  });
  it("sends messages to the socket", () => {
    const messageHandler = jest.fn();
    socket.on("send chat message", messageHandler);
    sagaTester.start(messagesSaga, socket);
    sagaTester.dispatch(confirmAuth(true));
    sagaTester.dispatch(joinGame(13));
    expect(sagaTester.getState().game.id).toBe(13);
    sagaTester.dispatch({ type: SEND_MESSAGE, message: "hello!" });
    expect(messageHandler.mock.calls.length).toBe(1);
    expect(messageHandler.mock.calls[0][0]).toEqual({
      message: "hello!",
      gameId: 13
    });
  });
});
