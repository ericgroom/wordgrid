import io from "socket.io-client";
import { take, all, put, fork } from "redux-saga/effects";

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
    const chatSocket = io(`${process.env.REACT_APP_BACKEND_HOST}/chat`, {
      path: process.env.REACT_APP_SOCKET_PATH
    });
    yield fork(userFlow, gameSocket);
    yield take(CONFIRM_AUTH);
    console.log("starting game and message flow");
    yield all([messagesFlow(chatSocket), gameFlow(gameSocket)]);
  }
}
