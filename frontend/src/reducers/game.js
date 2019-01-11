import get from "lodash/get";
import findIndex from "lodash/findIndex";
import {
  REQUEST_CREATE_GAME,
  GAME_CREATED,
  GAME_STATE_UPDATE,
  JOIN_GAME,
  LEAVE_GAME,
  UPDATE_WORD,
  WORD_COMPLETED,
  USER_JOIN,
  WORD_SENT,
  START_GAME,
  START_COUNTDOWN,
  REJOINED,
  END_GAME
} from "../actions";

const initialState = {
  id: null,
  created: false,
  started: false,
  ended: false,
  countdown: false,
  countdownDuration: 0,
  duration: 0,
  joined: false,
  loading: false,
  exists: true,
  grid: null,
  words: [],
  wordId: 0,
  sentWords: [], // words already sent to the backend so that saga can avoid duplicates
  users: []
};

const updateWord = (state, action) => {
  const words = state.words;
  const wordIndex = findIndex(words, word => word.id === action.word.id);
  const word = words[wordIndex];
  const updatedWord = { ...word, ...action.word };
  let updatedWords = [...words];
  updatedWords[wordIndex] = updatedWord;
  return { ...state, words: updatedWords };
};

const wordCompleted = (state, action) => {
  // don't add word if the length is less than 3 or already added
  if (
    action.word.word.length < 3 ||
    state.words.some(({ word }) => word === action.word.word)
  ) {
    return state;
  }
  return {
    ...state,
    wordId: state.wordId + 1,
    words: [...state.words, { word: action.word.word, id: state.wordId }]
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_CREATE_GAME:
      return { ...state, created: true };
    case GAME_CREATED:
      return { ...state, id: action.id };
    case GAME_STATE_UPDATE:
      return { ...state, ...action.state, loading: false };
    case JOIN_GAME:
      return { ...state, id: action.id, joined: true, loading: true };
    case LEAVE_GAME:
      return initialState;
    case UPDATE_WORD:
      return updateWord(state, action);
    case WORD_COMPLETED:
      return wordCompleted(state, action);
    case WORD_SENT:
      return { ...state, sentWords: [...state.sentWords, action.word] };
    case USER_JOIN:
      return { ...state, users: [...state.users, action.nickname] };
    case START_GAME:
      return { ...state, started: true };
    case START_COUNTDOWN:
      return { ...state, countdown: true, countdownDuration: action.duration };
    case REJOINED:
      return {
        ...state,
        duration: action.durationRemaining
      };
    case END_GAME:
      return { ...state, ended: true };
    default:
      return state;
  }
};

/**
 * Get the score for a particular user
 * @param {object} state redux store state
 * @param {number} userId userId to fetch score for
 */
export const getScoreOfUser = (state, userId) => {
  return state.users.length > 0
    ? state.users
      ? get(state.users.find(user => user.id === userId), "score", 0)
      : 0
    : 0;
};

export const getGameState = state => {
  if (state.loading) return "loading";
  if (!state.exists) return "non-existant";
  if (state.ended) return "ended";
  if (!state.started) return "pregame";
  if (state.started) return "active";
  throw new Error("unaccounted case in getGameState");
};
