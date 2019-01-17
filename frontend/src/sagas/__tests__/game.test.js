import SagaTester from "redux-saga-tester";
import rootReducer from "../../reducers";
import gameSaga, {
  gameSocketChannel,
  gameActionListener,
  gameCreateListener
} from "../game";
import {
  updateGameState,
  updateWord,
  startCountdown,
  endGame,
  rejoined,
  confirmAuth,
  joinGame,
  completeWord,
  ADD_WORD,
  startGame,
  leaveGame,
  createGame,
  GAME_CREATED
} from "../../actions";

function waitForChannel(channel, ...args) {
  const initChannel = channel(...args);
  return new Promise(resolve => initChannel.take(resolve));
}

describe("gameSocketChannel", () => {
  let socket;
  let mock;
  beforeEach(() => {
    socket = createMockSocket();
    mock = jest.fn();
  });
  it("listens for `state` updates", async () => {
    const stateUpdate = { id: 2, grid: "asdf" };
    const stateUpdateWithGrid = { id: 2, grid: ["a", "s", "d", "f"] };
    socket.on("state", mock);
    const task = waitForChannel(gameSocketChannel, socket);
    socket.emit("state", stateUpdate);
    const action = await task;
    expect(action).toEqual(updateGameState(stateUpdateWithGrid));
  });
  it("listens for `not exists` event", async () => {
    socket.on("not exists", mock);
    const task = waitForChannel(gameSocketChannel, socket);
    socket.emit("not exists");
    const action = await task;
    expect(action).toEqual(updateGameState({ exists: false }));
  });
  it("listens for `word` event", async () => {
    socket.on("word", mock);
    const task = waitForChannel(gameSocketChannel, socket);
    const word = { id: 2, valid: true, score: 90 };
    socket.emit("word", word);
    const action = await task;
    expect(action).toEqual(updateWord(word));
  });
  it("listens for `countdown` event", async () => {
    socket.on("countdown", mock);
    const task = waitForChannel(gameSocketChannel, socket);
    socket.emit("countdown", 3);
    const action = await task;
    expect(action).toEqual(startCountdown(3));
  });
  it("listens for `end game` event", async () => {
    socket.on("end game", mock);
    const task = waitForChannel(gameSocketChannel, socket);
    socket.emit("end game");
    const action = await task;
    expect(action).toEqual(endGame());
  });
  it("listens for `remaining time` event", async () => {
    socket.on("remaining time", mock);
    const task = waitForChannel(gameSocketChannel, socket);
    socket.emit("remaining time", 3);
    const action = await task;
    expect(action).toEqual(rejoined(3));
  });
  it("listens for `played words`", async () => {
    const words = [{ id: 0, word: "asdf" }, { id: 1, word: "fdsa" }];
    const expectedState = {
      wordIds: [0, 1],
      wordsById: { 0: { id: 0, word: "asdf" }, 1: { id: 1, word: "fdsa" } },
      nextWordId: 2
    };
    socket.on("played words", mock);
    const task = waitForChannel(gameSocketChannel, socket);
    socket.emit("played words", words);
    const action = await task;
    expect(action).toEqual(updateGameState(expectedState));
  });
});

describe("gameActionListener", () => {
  let socket;
  let sagaTester;
  beforeEach(() => {
    socket = createMockSocket();
    sagaTester = new SagaTester({
      reducers: rootReducer
    });
    sagaTester.dispatch(confirmAuth(true));
    sagaTester.dispatch(joinGame(123));
  });
  it("listens for `WORD_COMPLETED`, sends it to socket, and emits `ADD_WORD`", () => {
    const listener = jest.fn();
    socket.on("word", listener);
    sagaTester.start(gameActionListener, socket);
    sagaTester.dispatch(completeWord({ word: "asdf", path: [1, 2, 3, 4] }));
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0]).toEqual({
      id: 0,
      word: "asdf",
      path: [1, 2, 3, 4]
    });
    expect(listener.mock.calls[0][1]).toBe(123);
    expect(sagaTester.wasCalled(ADD_WORD));
  });
  it("requests socket to start game", () => {
    const listener = jest.fn();
    socket.on("game start", listener);
    sagaTester.start(gameActionListener, socket);
    sagaTester.dispatch(startGame());
    expect(listener.mock.calls.length).toBe(1);
  });
  it("tells socket when leaving game", () => {
    const listener = jest.fn();
    socket.on("leave game", listener);
    sagaTester.start(gameActionListener, socket);
    sagaTester.dispatch(leaveGame());
    expect(listener.mock.calls.length).toBe(1);
  });
});

describe("gameCreateListener", () => {
  afterEach(() => {
    fetch.resetMocks();
  });
  it("calls createGame when `REQUEST_CREATE_GAME` is dispatched", async () => {
    fetch.mockResponse(JSON.stringify({ gameId: 2 }));
    const sagaTester = new SagaTester({ reducers: rootReducer });
    sagaTester.start(gameCreateListener);
    sagaTester.dispatch(createGame());
    expect(fetch.mock.calls.length).toBe(1);
    await sagaTester.waitFor(GAME_CREATED);
  });
});

describe("gameSocketFlow", () => {
  it("listens for actions and emits to socket", () => {
    const socket = createMockSocket();
    const sagaTester = new SagaTester({ reducers: rootReducer });
    const startListener = jest.fn();
    socket.on("join game", startListener);
    sagaTester.start(gameSaga, socket);
    sagaTester.dispatch(confirmAuth(true));
    sagaTester.dispatch(joinGame(123));
    expect(startListener.mock.calls.length).toBe(1);
  });
});
