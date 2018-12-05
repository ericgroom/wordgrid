import jwt_decode from "jwt-decode";
import { eventChannel } from "redux-saga";
import { call, put, all, take } from "redux-saga/effects";
import { putFrom } from "./index";
import {
  SENT_AUTH,
  SET_NICKNAME,
  REQUEST_SET_NICKNAME,
  SET_TOKEN,
  setUserId
} from "../actions";

function* userFlow(socket) {
  yield call(auth, socket);
  const authChannel = yield call(authSocketChannel, socket);
  yield all([putFrom(authChannel), listenNickname(socket)]);
}

function* auth(socket) {
  if (localStorage.authToken) {
    socket.emit("auth", localStorage.authToken);
    yield put({ type: SENT_AUTH, new: false });
    const { userId } = jwt_decode(localStorage.authToken);
    yield put(setUserId(userId));
  } else {
    socket.emit("new auth");
    yield put({ type: SENT_AUTH, new: true });
  }
}

function authSocketChannel(socket) {
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

function* listenNickname(socket) {
  while (true) {
    const { nickname } = yield take(REQUEST_SET_NICKNAME);
    console.log("setting!");
    socket.emit("nickname", nickname);
  }
}

export default userFlow;
