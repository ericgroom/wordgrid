import { eventChannel, buffers } from "redux-saga";
import { take, call, all, select, actionChannel } from "redux-saga/effects";
import { SEND_MESSAGE, receivedMessage } from "../actions";
import { putFrom, awaitAuthIfNeeded } from "./index";

export default function* messagesFlow(socket) {
  while (true) {
    const socketChannel = yield call(messageListener, socket);
    yield all([putFrom(socketChannel), messageActionListener(socket)]);
  }
}

/**
 * Listens for specific actions and handles them. These should be limited to
 * actions that need to emit to a socket.
 * @param {*} socket socket.io instance
 */
export function* messageActionListener(socket) {
  const channel = yield actionChannel([SEND_MESSAGE], buffers.expanding(5));
  yield call(awaitAuthIfNeeded);
  while (true) {
    const action = yield take(channel);
    switch (action.type) {
      case SEND_MESSAGE:
        const gameId = yield select(state => state.game.id);
        if (gameId) {
          socket.emit("send chat message", { message: action.message, gameId });
        }
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
 * Listens to chat socket and emits actions based on socket events
 * @param {*} socket socket.io socket instance
 */
export function messageListener(socket) {
  return eventChannel(emit => {
    socket.on("chat message", msg => {
      return emit(receivedMessage(msg));
    });
    return () => {
      console.log("closing socket");
      socket.close();
    };
  });
}
