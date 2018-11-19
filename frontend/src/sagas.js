import { eventChannel } from "redux-saga";
import { take, all, call, put, fork } from "redux-saga/effects";
import io from "socket.io-client";
import {
  updateGameState,
  CREATE_GAME,
  joinGame,
  JOIN_GAME,
  LEAVE_GAME
} from "./actions";

const RECIEVED_MESSAGE = "RECIEVED_MESSAGE";
const SEND_MESSAGE = "SEND_MESSAGE";

const recievedMessage = message => ({ type: RECIEVED_MESSAGE, message });

/**
 * Listens to chat socket and emits actions based on socket events
 * @param {*} socket socket.io socket instance
 */
function messageListener(socket) {
  return eventChannel(emit => {
    socket.on("chat message", msg => {
      return emit(recievedMessage(msg));
    });
    return () => {
      console.log("closing socket");
      socket.close();
    };
  });
}

/**
 * Creates socket.io instance and emits actions based on events
 */
function* gameSocketListener() {
  while (true) {
    const action = yield take(JOIN_GAME);
    const socket = io.connect("http://localhost:3001/game");
    socket.emit("join game", { id: action.id });
    yield call(
      putFrom,
      eventChannel(emit => {
        socket.on("state", initialState => {
          const grid = initialState.grid
            ? initialState.grid.split("")
            : initialState.grid;
          emit(updateGameState({ ...initialState, grid }));
        });
        socket.on("not exists", () => emit(updateGameState({ exists: false })));
        return () => {
          socket.close();
          emit({ type: LEAVE_GAME });
        };
      })
    );
  }
}

/**
 * Listens to non-socket related game actions
 */
function* gameActionListener() {
  while (true) {
    console.log("starting gameActionListener");
    const action = yield take(CREATE_GAME);
    switch (action.type) {
      case CREATE_GAME:
        yield call(createGame);
        break;
      default:
        throw new Error(
          `messageActionListener saga took action but has no handler for: ${
            action.type
          }`
        );
    }
  }
}

/**
 * puts all actions emitted by an eventChannel, assuming that channel only emits actions
 * @param {*} socketChannel eventChannel instance
 */
function* putFrom(socketChannel) {
  while (true) {
    const action = yield take(socketChannel);
    yield put(action);
  }
}

/**
 * Flow for creating a game.
 */
function* createGame() {
  const res = yield call(fetch, "http://localhost:3001/game/new");
  const { gameId } = yield call([res, "json"]);
  yield put(joinGame(gameId));
}

/**
 * Listens for specific actions and handles them. These should be limited to
 * actions that need to emit to a socket.
 * @param {*} socket socket.io instance
 */
function* messageActionListener(socket) {
  while (true) {
    const action = yield take([SEND_MESSAGE]);
    switch (action.type) {
      case SEND_MESSAGE:
        socket.emit("chat message", action.message);
        break;
      default:
        throw new Error(
          `messageActionListener saga took action but has no handler for: ${
            action.type
          }`
        );
    }
  }
}

/**
 * root saga:
 * creates chat socket and eventChannel
 * listens to actions and socket.io events
 * @param url url for chat socket
 */
export default url =>
  function* socketSaga() {
    while (true) {
      const socket = io.connect(url);
      const socketChannel = yield call(messageListener, socket);
      yield all([
        messageActionListener(socket),
        putFrom(socketChannel),
        gameSocketListener(),
        gameActionListener()
      ]);
    }
  };
