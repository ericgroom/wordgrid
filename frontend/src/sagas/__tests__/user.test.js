import SagaTester from "redux-saga-tester";
import rootReducer from "../../reducers";
import userSaga, {
  authSocketChannel,
  userSocketChannel,
  userActionListener
} from "../user";
import {
  SET_TOKEN,
  SET_NICKNAME,
  confirmAuth,
  setNickname
} from "../../actions";

describe("authSocketChannel", () => {
  let socket;
  let authToken;
  beforeAll(() => {
    authToken = window.localStorage.getItem("authToken");
  });
  afterAll(() => {
    window.localStorage.setItem("authToken", authToken);
  });
  beforeEach(() => {
    socket = createMockSocket();
  });
  it("handles auth properly", () => {
    const authMock = jest.fn();
    const newAuthMock = jest.fn();
    window.localStorage.setItem("authToken", "asdf");
    socket.on("auth", authMock);
    socket.on("new auth", newAuthMock);

    const eventChannel = authSocketChannel(socket);
    expect(authMock.mock.calls.length).toBe(1);
    const serverAck = authMock.mock.calls[0][1];
    // more in-depth testing requires a valid jwt token
    // and the added dependency doesn't seem worth it in this case
    //serverAck(true);
    expect(newAuthMock.mock.calls.length).toBe(0);
  });
});
describe("userSocketChannel", () => {
  let socket;
  beforeEach(() => {
    socket = createMockSocket();
  });
  it("listens for `token` socket event and puts action", async () => {
    const tokenMock = jest.fn();
    socket.on("token", tokenMock);
    const channel = userSocketChannel(socket);
    const take = new Promise(resolve => channel.take(resolve));
    socket.emit("token", "asfd");
    const action = await take;
    expect(action).toEqual({ type: SET_TOKEN });
  });

  it("listens for `nickname` socket event and puts action", async () => {
    const nicknameMock = jest.fn();
    socket.on("nickname", nicknameMock);
    const channel = userSocketChannel(socket);
    const take = new Promise(resolve => channel.take(resolve));
    socket.emit("nickname", "asfd");
    const action = await take;
    expect(action).toEqual({ type: SET_NICKNAME, nickname: "asfd" });
  });
  it("listens for `give token` socket event and puts action", () => {
    const giveTokenMock = jest.fn();
    socket.on("give token", giveTokenMock);
    window.localStorage.setItem("authToken", "test token");
    const channel = userSocketChannel(socket);
    const callback = jest.fn();
    socket.emit("give token", callback);
    expect(callback.mock.calls.length).toBe(1);
    expect(callback.mock.calls[0][0]).toBe("test token");
  });
});
describe("userActionListener", () => {
  let sagaTester;
  let socket;
  beforeEach(() => {
    socket = createMockSocket();
    sagaTester = new SagaTester({ reducers: rootReducer });
  });
  it("listens for appropriate actions and emits to socket", () => {
    const nicknameMock = jest.fn();
    socket.on("nickname", nicknameMock);
    sagaTester.start(userActionListener, socket);
    sagaTester.dispatch(confirmAuth(true));
    sagaTester.dispatch(setNickname("test nick"));
    expect(nicknameMock.mock.calls.length).toBe(1);
    expect(nicknameMock.mock.calls[0][0]).toBe("test nick");
  });
});

describe("userSaga", () => {
  let sagaTester;
  let socket;
  let authToken;
  beforeAll(() => {
    authToken = window.localStorage.getItem("authToken");
  });
  afterAll(() => {
    window.localStorage.setItem("authToken", authToken);
  });
  beforeEach(() => {
    sagaTester = new SagaTester({ reducers: rootReducer });
    socket = createMockSocket();
  });
  it("listens for user actions and dispatches events to socket", async () => {
    const token = "asdfasdfasdfafds";
    window.localStorage.setItem("authToken", token);
    const authListener = jest.fn();
    socket.on("auth", authListener);
    sagaTester.start(userSaga, socket);
    expect(authListener.mock.calls.length).toBe(1);
    expect(authListener.mock.calls[0][0]).toBe(token);

    socket.emit("nickname", "testing nickname");
    expect(sagaTester.wasCalled(SET_NICKNAME)).toBe(true);
  });
});
