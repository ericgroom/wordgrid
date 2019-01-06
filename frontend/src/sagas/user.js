import jwt_decode from "jwt-decode";
import { eventChannel } from "redux-saga";
import { call, all, take } from "redux-saga/effects";
import { putFrom, awaitAuthIfNeeded } from "./index";
import {
  SENT_AUTH,
  SET_NICKNAME,
  REQUEST_SET_NICKNAME,
  SET_TOKEN,
  setUserId,
  confirmAuth,
  CONFIRM_AUTH
} from "../actions";

function* userFlow(socket) {
  const authChannel = yield call(authSocketChannel, socket);
  const userChannel = yield call(userSocketChannel, socket);
  yield all([
    putFrom(userChannel),
    putFrom(authChannel),
    userActionListener(socket)
  ]);
}

function authSocketChannel(socket) {
  return eventChannel(emitter => {
    if (localStorage.authToken) {
      socket.emit("auth", localStorage.authToken, success => {
        emitter(confirmAuth(success));
        const { userId } = jwt_decode(localStorage.authToken);
        emitter(setUserId(userId));
      });
      emitter({ type: SENT_AUTH, new: false });
    } else {
      socket.emit("new auth", success => {
        emitter(confirmAuth(success));
      });
      emitter({ type: SENT_AUTH, new: true });
    }
    return () => {};
  });
}

function userSocketChannel(socket) {
  return eventChannel(emit => {
    socket.on("token", token => {
      localStorage.authToken = token;
      emit({ type: SET_TOKEN });
    });
    socket.on("nickname", nickname => {
      emit({ type: SET_NICKNAME, nickname });
    });
    return () => {
      console.log("in unsub");
    };
  });
}

function* userActionListener(socket) {
  yield call(awaitAuthIfNeeded);
  while (true) {
    console.log("userActionListener waiting...");
    const action = yield take(REQUEST_SET_NICKNAME, CONFIRM_AUTH);
    console.log("userActionListener taking action", action.type);
    switch (action.type) {
      case REQUEST_SET_NICKNAME:
        console.log("setting!");
        socket.emit("nickname", action.nickname);
        break;
      case CONFIRM_AUTH:
        console.log(`confirmed auth. success? ${action.success}`);
        break;
      default:
        throw new Error(
          `userActionListener saga took action but has no handler for: ${
            action.type
          }`
        );
    }
  }
}

export default userFlow;
