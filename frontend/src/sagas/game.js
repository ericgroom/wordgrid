import { eventChannel } from "redux-saga";
import { take, race, all, call, put, select } from "redux-saga/effects";
import max from "lodash/max";
import find from "lodash/find";

import {
  updateGameState,
  REQUEST_CREATE_GAME,
  gameCreated,
  JOIN_GAME,
  LEAVE_GAME,
  updateWord,
  WORD_COMPLETED,
  userJoined,
  sentWord,
  REQUEST_START_GAME,
  startCountdown,
  rejoined,
  endGame
} from "../actions";
import { putFrom, awaitAuthIfNeeded } from "./index";

function* gameSocketFlow(socket) {
  while (true) {
    try {
      console.log("restarting gameSocketFlow");
      const action = yield take(JOIN_GAME);
      yield call(awaitAuthIfNeeded);
      socket.emit("join game", { id: action.id });
      const socketChannel = yield call(gameSocketChannel, socket);
      yield race([putFrom(socketChannel), gameActionListener(socket)]);
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 * Creates socket.io instance and emits actions based on events
 */
function gameSocketChannel(socket) {
  return eventChannel(emit => {
    socket.on("state", updatedState => {
      let state = { ...updatedState };
      if (state.grid) state.grid = state.grid.split("");
      emit(updateGameState(state));
    });
    socket.on("not exists", () => emit(updateGameState({ exists: false })));
    socket.on("word", word => {
      console.log(word);
      emit(updateWord(word));
    });
    socket.on("user join", nickname => {
      console.log(`${nickname} joined`);
      emit(userJoined(nickname));
    });
    socket.on("countdown", duration => {
      emit(startCountdown(duration));
    });
    socket.on("end game", () => {
      emit(endGame());
    });
    socket.on("remaining time", durationRemaining => {
      emit(rejoined(durationRemaining));
    });
    socket.on("played words", words => {
      emit(
        updateGameState({
          words,
          wordId: max(words.map(word => word.id)) + 1 || 0,
          sentWords: words.map(word => word.word)
        })
      );
    });
    return () => {
      emit({ type: LEAVE_GAME });
    };
  });
}

function* gameActionListener(socket) {
  yield call(awaitAuthIfNeeded);
  loop: while (true) {
    console.log("gameActionListener waiting...");
    const action = yield take([WORD_COMPLETED, REQUEST_START_GAME, LEAVE_GAME]);
    const gameId = yield select(state => state.game.id);
    switch (action.type) {
      case WORD_COMPLETED:
        // eslint-disable-next-line
        const { word, path } = action.word;
        // validate word
        // don't send words less than 3 letters long
        const tooShort = word.length < 3;
        // check if word has already been sent
        const sentWords = yield select(state => state.game.sentWords);
        const alreadySent = sentWords.some(sentWord => sentWord === word);

        // send the word
        if (!tooShort && !alreadySent) {
          const words = yield select(state => state.game.words);
          const wordId = find(words, { word }).id;
          const gameId = yield select(state => state.game.id);
          socket.emit("word", { word, wordId, gameId, path });
          yield put(sentWord(word));
        }
        break;
      case REQUEST_START_GAME:
        console.log(`starting game: ${gameId}`);
        socket.emit("game start", { id: gameId });
        break;
      case LEAVE_GAME:
        socket.emit("leave game", action.id);
        break loop;
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
 * Listens to non-socket related game actions
 */
function* gameCreateListener() {
  while (true) {
    console.log("starting gameCreateListener");
    const action = yield take(REQUEST_CREATE_GAME);
    switch (action.type) {
      case REQUEST_CREATE_GAME:
        yield call(createGame);
        continue;
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
  try {
    const url = `${process.env.REACT_APP_BACKEND_URL}/game/new`;
    console.log(url);
    const res = yield call(fetch, url);
    const { gameId } = yield call([res, "json"]);
    yield put(gameCreated(gameId));
  } catch (e) {
    console.error(e);
  }
}

export default function* gameFlow(socket) {
  while (true) {
    yield all([gameSocketFlow(socket), gameCreateListener()]);
  }
}
