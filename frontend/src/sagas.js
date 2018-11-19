import { eventChannel } from "redux-saga";
import { take, all, call, put } from "redux-saga/effects";
import io from "socket.io-client";

const RECIEVED_MESSAGE = "RECIEVED_MESSAGE";
const SEND_MESSAGE = "SEND_MESSAGE";

const recievedMessage = message => ({ type: RECIEVED_MESSAGE, message });

function messageListener(socket) {
  return eventChannel(emitter => {
    console.log("initial messageListener run");
    socket.on("chat message", msg => {
      console.log("got message");
      return emitter(recievedMessage(msg));
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

function* actionListener(socket) {
  while (true) {
    const action = yield take(SEND_MESSAGE);
    console.log("sending a message?");
    socket.emit("chat message", action.message);
  }
}

export default url =>
  function* socketSaga() {
    while (true) {
      console.log("spinnin up the ol' socket");
      const socket = io.connect(url);
      const socketChannel = yield call(messageListener, socket);
      yield all([actionListener(socket), putFrom(socketChannel)]);
    }
  };
