import { eventChannel } from "redux-saga";
import { take, all, call, put } from "redux-saga/effects";
import io from "socket.io-client";
import { updateGameState, CREATE_GAME, GAME_STATE_UPDATE } from "./actions";

const RECIEVED_MESSAGE = "RECIEVED_MESSAGE";
const SEND_MESSAGE = "SEND_MESSAGE";

const recievedMessage = message => ({ type: RECIEVED_MESSAGE, message });

function messageListener(socket) {
  return eventChannel(emit => {
    socket.on("chat message", msg => {
      return emit(recievedMessage(msg));
    });
    socket.on("game state", payload => {
      emit(updateGameState(payload));
    });
    return () => {
      console.log("closing socket");
      socket.close();
    };
  });
}

function* putFrom(socketChannel) {
  while (true) {
    const action = yield take(socketChannel);
    yield put(action);
  }
}

function* createGame() {
  console.log("calling fetch");
  const res = yield call(fetch, "http://localhost:3001/game/new");
  console.log("calling json");
  const { gameId } = yield call([res, "json"]);
  yield put(updateGameState({ id: gameId, created: true }));
}

function* actionListener(socket) {
  while (true) {
    const action = yield take([SEND_MESSAGE, CREATE_GAME]);
    switch (action.type) {
      case SEND_MESSAGE:
        socket.emit("chat message", action.message);
        break;
      case CREATE_GAME:
        console.log("create game");
        yield call(createGame);
        break;
      default:
        throw new Error(
          `actionListener saga took action but has no handler for: ${
            action.type
          }`
        );
    }
  }
}

export default url =>
  function* socketSaga() {
    while (true) {
      const socket = io.connect(url);
      const socketChannel = yield call(messageListener, socket);
      yield all([actionListener(socket), putFrom(socketChannel)]);
    }
  };
