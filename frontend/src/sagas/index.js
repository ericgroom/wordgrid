import io from "socket.io-client";
import { take, all, put } from "redux-saga/effects";

import gameFlow from "./game";
import messagesFlow from "./messages";
import userFlow from "./user";

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
    const gameSocket = io("localhost:3001/game");
    const chatSocket = io("localhost:3001/chat");
    yield all([
      messagesFlow(chatSocket),
      gameFlow(gameSocket),
      userFlow(gameSocket)
    ]);
  }
}
