import { eventChannel } from "redux-saga";
import { take, all, call, put, select } from "redux-saga/effects";
import _ from "lodash";
import {
  updateGameState,
  CREATE_GAME,
  joinGame,
  JOIN_GAME,
  LEAVE_GAME,
  updateWord,
  WORD_COMPLETED,
  userJoined,
  sentWord
} from "../actions";
import { putFrom } from "./index";

function* gameSocketFlow(socket) {
  while (true) {
    try {
      const action = yield take(JOIN_GAME);
      socket.emit("join game", { id: action.id });
      const socketChannel = yield call(gameSocketChannel, socket);
      yield all([putFrom(socketChannel), gameActionListener(socket)]);
    } catch (e) {
      console.log(socket);
      console.error(e);
    }
  }
}

/**
 * Creates socket.io instance and emits actions based on events
 */
function gameSocketChannel(socket) {
  return eventChannel(emit => {
    socket.on("state", initialState => {
      emit(updateGameState(initialState));
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
    return () => {
      console.log("leaving");
      emit({ type: LEAVE_GAME });
    };
  });
}

function* gameActionListener(socket) {
  while (true) {
    console.log("awaiting action");
    const action = yield take([WORD_COMPLETED]);
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
          const wordId = _.find(words, { word }).id;
          const gameId = yield select(state => state.game.id);
          socket.emit("word", { word, wordId, gameId });
          yield put(sentWord(word));
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
 * Listens to non-socket related game actions
 */
function* gameCreateListener() {
  while (true) {
    console.log("starting gameCreateListener");
    const action = yield take(CREATE_GAME);
    switch (action.type) {
      case CREATE_GAME:
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
  console.log("here");
  const res = yield call(fetch, "http://localhost:3001/game/new");
  const { gameId } = yield call([res, "json"]);
  yield put(joinGame(gameId));
}

export default function* gameFlow(socket) {
  while (true) {
    yield all([gameSocketFlow(socket), gameCreateListener()]);
  }
}
