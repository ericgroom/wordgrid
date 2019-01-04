import { eventChannel } from "redux-saga";
import { take, call, all, select } from "redux-saga/effects";
import { SEND_MESSAGE, recievedMessage } from "../actions";
import { putFrom } from "./index";

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
function* messageActionListener(socket) {
  while (true) {
    const action = yield take([SEND_MESSAGE]);
    switch (action.type) {
      case SEND_MESSAGE:
        const gameId = yield select(state => state.game.id);
        if (Number.isInteger(gameId)) {
          socket.emit("chat message", { message: action.message, gameId });
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
