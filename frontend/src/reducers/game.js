import get from "lodash/get";
import {
  REQUEST_CREATE_GAME,
  GAME_CREATED,
  GAME_STATE_UPDATE,
  JOIN_GAME,
  LEAVE_GAME,
  UPDATE_WORD,
  START_GAME,
  START_COUNTDOWN,
  REJOINED,
  END_GAME,
  ADD_WORD
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
  wordsById: {},
  wordIds: [],
  nextWordId: 0,
  users: []
};

const updateWord = (state, action) => {
  const word = state.wordsById[action.word.id];
  const updatedWord = { ...word, ...action.word };
  const wordsById = {
    ...state.wordsById,
    [action.word.id]: updatedWord
  };
  return {
    ...state,
    wordsById
  };
};

const addWord = (state, action) => {
  const wordIds = [...state.wordIds, action.word.id];
  const wordsById = { ...state.wordsById, [action.word.id]: action.word };
  return { ...state, wordIds, wordsById, nextWordId: state.nextWordId + 1 };
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
    case ADD_WORD:
      return addWord(state, action);
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

/**
 * Get the current state of the game as a string.
 * @param {object} state state local to this reducer
 */
export const getGameState = state => {
  if (state.loading) return "loading";
  if (!state.exists) return "non-existant";
  if (state.ended) return "ended";
  if (!state.started) return "pregame";
  if (state.started) return "active";
  if (process.env.NODE_ENV !== "production")
    throw new Error("unaccounted case in getGameState");
  return "non-existant";
};

/**
 * Gets all words played by the user.
 * @param {object} state state local to this reducer
 */
export const getAllWords = state =>
  state.wordIds.map(id => state.wordsById[id]);
