import { eventChannel } from "redux-saga";
import { take, race, all, call, put, select } from "redux-saga/effects";
import _ from "lodash";
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
  endGame
} from "../actions";
import { putFrom } from "./index";

function* gameSocketFlow(socket) {
  while (true) {
    try {
      const action = yield take(JOIN_GAME);
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
    socket.on("start game", gameState => {
      emit(updateGameState(gameState));
    });
    socket.on("countdown", duration => {
      emit(startCountdown(duration));
    });
    socket.on("end game", () => {
      emit(endGame());
    });
    return () => {
      console.log("leaving");
      emit({ type: LEAVE_GAME });
    };
  });
}

function* gameActionListener(socket) {
  loop: while (true) {
    console.log("awaiting action");
    const action = yield take([WORD_COMPLETED, REQUEST_START_GAME, LEAVE_GAME]);
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
      case REQUEST_START_GAME:
        const gameId = yield select(state => state.game.id);
        console.log(`starting game: ${gameId}`);
        socket.emit("game start", { id: gameId });
        break;
      case LEAVE_GAME:
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
  const res = yield call(fetch, "http://localhost:3001/game/new");
  const { gameId } = yield call([res, "json"]);
  yield put(gameCreated(gameId));
}

export default function* gameFlow(socket) {
  while (true) {
    yield all([gameSocketFlow(socket), gameCreateListener()]);
  }
}
