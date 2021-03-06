import { eventChannel, buffers } from "redux-saga";
import {
  take,
  race,
  all,
  call,
  put,
  select,
  actionChannel
} from "redux-saga/effects";
import max from "lodash/max";
import { getAllWords } from "../reducers/game";

import {
  updateGameState,
  REQUEST_CREATE_GAME,
  gameCreated,
  JOIN_GAME,
  LEAVE_GAME,
  updateWord,
  WORD_COMPLETED,
  REQUEST_START_GAME,
  startCountdown,
  rejoined,
  endGame,
  addWord
} from "../actions";
import { putFrom, awaitAuthIfNeeded } from "./index";

function* gameSocketFlow(socket) {
  while (true) {
    try {
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
export function gameSocketChannel(socket) {
  return eventChannel(emit => {
    socket.on("state", updatedState => {
      let state = { ...updatedState };
      if (state.grid) state.grid = state.grid.split("");
      emit(updateGameState(state));
    });
    socket.on("not exists", () => emit(updateGameState({ exists: false })));
    socket.on("word", word => {
      emit(updateWord(word));
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
          wordIds: words.map(word => word.id),
          wordsById: words.reduce((acc, word) => {
            acc[word.id] = word;
            return acc;
          }, {}),
          nextWordId: max(words.map(word => word.id)) + 1 || 0
        })
      );
    });
    return () => {
      emit({ type: LEAVE_GAME });
    };
  });
}

export function* gameActionListener(socket) {
  const channel = yield actionChannel(
    [WORD_COMPLETED, REQUEST_START_GAME, LEAVE_GAME],
    buffers.sliding(10)
  );
  yield call(awaitAuthIfNeeded);
  loop: while (true) {
    const action = yield take(channel);
    const gameId = yield select(state => state.game.id);
    switch (action.type) {
      case WORD_COMPLETED:
        // eslint-disable-next-line
        const { word, path } = action.word;
        // validate word
        // don't send words less than 3 letters long
        const tooShort = word.length < 3;
        // check if word has already been sent
        const gameState = yield select(state => state.game);
        const alreadySent = getAllWords(gameState).some(
          sentWord => sentWord.word === word
        );

        // send the word
        if (!tooShort && !alreadySent) {
          const { id: gameId, nextWordId: wordId } = yield select(
            state => state.game
          );
          const wordObj = { word, id: wordId, path };
          yield put(addWord(wordObj));
          socket.emit("word", wordObj, gameId);
        }
        break;
      case REQUEST_START_GAME:
        socket.emit("game start", { id: gameId });
        break;
      case LEAVE_GAME:
        socket.emit("leave game", action.id);
        break loop; // restart game saga
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
export function* gameCreateListener() {
  while (true) {
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
