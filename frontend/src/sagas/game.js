import { eventChannel } from "redux-saga";
import { take, all, call, put, select } from "redux-saga/effects";
import io from "socket.io-client";
import _ from "lodash";
import {
  updateGameState,
  CREATE_GAME,
  joinGame,
  JOIN_GAME,
  LEAVE_GAME,
  updateWord,
  WORD_COMPLETED
} from "../actions";
import { putFrom } from "./index";

function* gameSocketFlow() {
  while (true) {
    const action = yield take(JOIN_GAME);
    const socket = io.connect("http://localhost:3001/game");
    socket.emit("join game", { id: action.id });
    const socketChannel = yield call(gameSocketChannel, socket);
    yield all([putFrom(socketChannel), gameActionListener(socket)]);
  }
}

/**
 * Creates socket.io instance and emits actions based on events
 */
function gameSocketChannel(socket) {
  return eventChannel(emit => {
    socket.on("state", initialState => {
      const grid = initialState.grid
        ? initialState.grid.split("")
        : initialState.grid;
      emit(updateGameState({ ...initialState, grid }));
    });
    socket.on("not exists", () => emit(updateGameState({ exists: false })));
    socket.on("word", word => {
      console.log(word);
      emit(updateWord(word));
    });
    return () => {
      socket.close();
      emit({ type: LEAVE_GAME });
    };
  });
}

function* gameActionListener(socket) {
  while (true) {
    const action = yield take(WORD_COMPLETED);
    const { word, path } = action.word;
    const words = yield select(state => state.game.words);
    const wordId = _.find(words, { word }).id;
    const gameId = yield select(state => state.game.id);
    socket.emit("word", { word, wordId, gameId });
  }
}

/**
 * Listens to non-socket related game actions
 */
function* gameCreateListener() {
  while (true) {
    console.log("starting gameCreateListener");
    const action = yield take(CREATE_GAME);
    switch (action.type) {
      case CREATE_GAME:
        yield call(createGame);
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
 * Flow for creating a game.
 */
function* createGame() {
  const res = yield call(fetch, "http://localhost:3001/game/new");
  const { gameId } = yield call([res, "json"]);
  yield put(joinGame(gameId));
}

export default function* gameFlow() {
  while (true) {
    yield all([gameSocketFlow(), gameCreateListener()]);
  }
}
