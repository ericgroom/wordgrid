import io from "socket.io-client";
import { take, all, put, select } from "redux-saga/effects";

import gameFlow from "./game";
import messagesFlow from "./messages";
import userFlow from "./user";
import { CONFIRM_AUTH } from "../actions";

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

export function* awaitAuthIfNeeded() {
  const isConfirmed = yield select(state => state.user.authConfirmed);
  if (!isConfirmed) {
    yield take(CONFIRM_AUTH);
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
    const gameSocket = io(`${process.env.REACT_APP_BACKEND_HOST}/game`, {
      path: process.env.REACT_APP_SOCKET_PATH
    });
    console.log("starting game and message flow");
    yield all([
      messagesFlow(gameSocket),
      gameFlow(gameSocket),
      userFlow(gameSocket)
    ]);
  }
}
