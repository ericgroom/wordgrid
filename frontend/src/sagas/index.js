import { take, all, put } from "redux-saga/effects";

import gameFlow from "./game";
import messagesFlow from "./messages";

/**
 * puts all actions emitted by an eventChannel, assuming that channel only emits actions
 * @param {*} socketChannel eventChannel instance
 */
export function* putFrom(socketChannel) {
  while (true) {
    const action = yield take(socketChannel);
    yield put(action);
  }
}

/**
 * root saga:
 * creates chat socket and eventChannel
 * listens to actions and socket.io events
 * @param url url for chat socket
 */
export default function* socketSaga() {
  while (true) {
    yield all([messagesFlow(), gameFlow()]);
  }
}
